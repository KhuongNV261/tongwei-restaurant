const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\temp\\edge_audit_' + Date.now();

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) {
          reject(msg.error);
        } else {
          resolve(msg.result);
        }
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res && res.exceptionDetails) {
      console.error('Eval exception:', JSON.stringify(res.exceptionDetails));
    }
    return res && res.result ? res.result.value : res;
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

async function run() {
  console.log('Launching Headless Edge for Responsive Audit...');
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:8088/'
  ]);

  try {
    let pages = null;
    for (let i = 0; i < 20; i++) {
      await wait(500);
      try {
        pages = await getJson('http://127.0.0.1:9222/json');
        if (pages && pages.length > 0) break;
      } catch (e) {}
    }

    if (!pages) {
      throw new Error('Could not connect to Edge DevTools');
    }

    const page = pages.find(p => p.url.includes('localhost:8088') || p.type === 'page');
    if (!page) {
      throw new Error('No target page found');
    }

    console.log('Target page found:', page.title, page.url);
    const client = new CDPClient(page.webSocketDebuggerUrl);
    await client.connect();
    console.log('Connected to CDP!');

    await wait(2000);

    const testWidths = [320, 360, 375, 412, 480];

    for (const width of testWidths) {
      console.log(`\n========================================`);
      console.log(`TESTING VIEWPORT: ${width}px x 800px`);
      console.log(`========================================`);

      await client.send('Emulation.setDeviceMetricsOverride', {
        width: width,
        height: 800,
        deviceScaleFactor: 1,
        mobile: true
      });

      await wait(500);

      const auditResult = await client.eval(`
        (() => {
          const winW = window.innerWidth;
          const docScrollW = document.documentElement.scrollWidth;
          const bodyScrollW = document.body.scrollWidth;

          // Find elements that overflow horizontally
          const allEls = Array.from(document.querySelectorAll('*'));
          const overflowingElements = [];

          function isClippedByScrollParent(el) {
            let parent = el.parentElement;
            while (parent && parent !== document.body && parent !== document.documentElement) {
              const cs = window.getComputedStyle(parent);
              if (cs.overflowX === 'auto' || cs.overflowX === 'scroll' || cs.overflowX === 'hidden') {
                const parentRect = parent.getBoundingClientRect();
                if (parentRect.right <= winW + 2) {
                  return true;
                }
              }
              parent = parent.parentElement;
            }
            return false;
          }

          for (const el of allEls) {
            if (isClippedByScrollParent(el)) continue;
            const rect = el.getBoundingClientRect();
            if (rect.right > winW + 1) {
              const overflowAmt = Math.round(rect.right - winW);
              overflowingElements.push({
                tag: el.tagName.toLowerCase(),
                id: el.id || '',
                className: (typeof el.className === 'string' ? el.className : ''),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                overflowAmount: overflowAmt,
                textSnippet: (el.innerText || '').slice(0, 40),
                outerHTML: el.outerHTML.slice(0, 120),
                parentTag: el.parentElement ? el.parentElement.tagName.toLowerCase() + (el.parentElement.className ? '.' + el.parentElement.className : '') : 'none'
              });
            }
          }

          const brandLogo = document.querySelector('.brand-logo');
          const navActions = document.querySelector('.nav-actions');
          const navContainer = document.querySelector('.nav-container');

          const menuCatTabs = document.querySelector('.menu-cat-tabs');
          const menuActionsRow = document.querySelector('.menu-actions-row');
          const menuBookStage = document.querySelector('.menu-book-stage');
          const prevBtn = document.querySelector('.book-nav-btn.prev-btn');
          const nextBtn = document.querySelector('.book-nav-btn.next-btn');
          const menuThumbs = document.querySelector('.menu-thumbs-scroll-wrapper');
          const menuBottomCta = document.querySelector('.menu-bottom-cta');

          return {
            winW,
            docScrollW,
            bodyScrollW,
            hasHorizontalScroll: docScrollW > winW || bodyScrollW > winW,
            overflowCount: overflowingElements.length,
            overflowingElements: overflowingElements.slice(0, 15),
            navMetrics: {
              brandLogo: brandLogo ? { w: Math.round(brandLogo.getBoundingClientRect().width), r: Math.round(brandLogo.getBoundingClientRect().right) } : null,
              navActions: navActions ? { w: Math.round(navActions.getBoundingClientRect().width), r: Math.round(navActions.getBoundingClientRect().right) } : null,
              navContainer: navContainer ? { w: Math.round(navContainer.getBoundingClientRect().width), r: Math.round(navContainer.getBoundingClientRect().right) } : null
            },
            menuMetrics: {
              menuCatTabs: menuCatTabs ? { w: Math.round(menuCatTabs.getBoundingClientRect().width), r: Math.round(menuCatTabs.getBoundingClientRect().right), scrollW: menuCatTabs.scrollWidth } : null,
              menuActionsRow: menuActionsRow ? { w: Math.round(menuActionsRow.getBoundingClientRect().width), r: Math.round(menuActionsRow.getBoundingClientRect().right) } : null,
              menuBookStage: menuBookStage ? { w: Math.round(menuBookStage.getBoundingClientRect().width), r: Math.round(menuBookStage.getBoundingClientRect().right) } : null,
              prevBtn: prevBtn ? { l: Math.round(prevBtn.getBoundingClientRect().left), r: Math.round(prevBtn.getBoundingClientRect().right) } : null,
              nextBtn: nextBtn ? { l: Math.round(nextBtn.getBoundingClientRect().left), r: Math.round(nextBtn.getBoundingClientRect().right) } : null,
              menuThumbs: menuThumbs ? { w: Math.round(menuThumbs.getBoundingClientRect().width), r: Math.round(menuThumbs.getBoundingClientRect().right), scrollW: menuThumbs.scrollWidth } : null,
              menuBottomCta: menuBottomCta ? { w: Math.round(menuBottomCta.getBoundingClientRect().width), r: Math.round(menuBottomCta.getBoundingClientRect().right) } : null
            }
          };
        })()
      `);

      console.log('Viewport: ' + auditResult.winW + 'px | Document ScrollWidth: ' + auditResult.docScrollW + 'px | Body ScrollWidth: ' + auditResult.bodyScrollW + 'px');
      console.log('Has Horizontal Scroll: ' + (auditResult.hasHorizontalScroll ? 'YES (BUG!)' : 'NO'));
      console.log('Overflowing elements count: ' + auditResult.overflowCount);

      if (auditResult.overflowingElements.length > 0) {
        console.log('Top overflowing elements:');
        for (const el of auditResult.overflowingElements) {
          console.log('  - <' + el.tag + ' id="' + el.id + '" class="' + el.className + '"> parent: ' + el.parentTag + ' | left=' + el.left + ', right=' + el.right + ', width=' + el.width + ', overflow=+' + el.overflowAmount + 'px | HTML: ' + el.outerHTML);
        }
      }

      console.log('Nav Metrics:', JSON.stringify(auditResult.navMetrics));
      console.log('Menu Metrics:', JSON.stringify(auditResult.menuMetrics));

      if (width === 375) {
        const screenshot = await client.send('Page.captureScreenshot', {
          format: 'png',
          clip: { x: 0, y: 0, width: 375, height: 1600, scale: 1 }
        });
        fs.writeFileSync('scripts/mobile_preview_375.png', Buffer.from(screenshot.data, 'base64'));
        console.log('Saved screenshot to scripts/mobile_preview_375.png');
      }
    }

    client.close();
  } catch (err) {
    console.error('Audit error:', err);
  } finally {
    proc.kill();
  }
}

run();
