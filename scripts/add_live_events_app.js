const fs = require('fs');

let appJs = fs.readFileSync('js/app.js', 'utf8');

const loadEventsFunction = `
// ==================== LOAD LIVE EVENTS FROM D1 / LOCAL ====================
async function loadLiveEvents() {
  const eventsGrid = document.querySelector('#tin-tuc .events-grid');
  if (!eventsGrid) return;

  let events = [];
  try {
    const res = await fetch('/api/events');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        events = data;
      }
    }
  } catch (e) {
    console.warn('API events fallback to local:', e);
  }

  if (!events || events.length === 0) {
    const local = localStorage.getItem('tongwei_events');
    if (local) {
      try { events = JSON.parse(local); } catch (e) {}
    }
  }

  if (events && events.length > 0) {
    // Populate eventData object for modal
    events.forEach(ev => {
      eventData[ev.id] = {
        title: ev.title,
        date: ev.date,
        img: ev.img,
        content: \`
          <div style="background: rgba(226, 35, 41, 0.06); border-left: 4px solid var(--color-brand-red); padding: 0.85rem 1rem; border-radius: 4px; margin-bottom: 1.25rem;">
            <b style="color: var(--color-brand-red); font-size: 1.05rem;">🎉 \${ev.title}</b>
            <p style="margin-top: 0.25rem; font-size: 0.9rem; color: var(--color-text-secondary);">\${ev.date}</p>
          </div>
          <p style="margin-bottom: 1rem; line-height: 1.7; color: var(--color-text-secondary);">
            \${ev.desc}
          </p>
          \${ev.detail ? \`
            <div style="background: #fafafa; border: 1px solid var(--color-border); border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-brand-red); margin-bottom: 0.6rem;">✨ CHI TIẾT CHƯƠNG TRÌNH & ĐÃI NGỘ:</h4>
              <div style="line-height: 1.8; font-size: 0.9rem; color: var(--color-text-primary); white-space: pre-line;">
                \${ev.detail}
              </div>
            </div>
          \` : ''}
          <div style="text-align: center; margin-top: 1.5rem;">
            <a href="#dat-ban" onclick="closeEventModal()" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 2rem; font-weight: 700;">
              <span>🏮</span> Đặt Bàn Ngay Để Nhận Ưu Đãi
            </a>
          </div>
        \`
      };
    });

    // Render cards
    eventsGrid.innerHTML = events.map(ev => {
      const isFeatured = ev.id === 4 || (ev.badge && ev.badge.includes('Soft Opening'));
      const badgeStyle = isFeatured ? 'background: var(--color-brand-red); color: #fff;' : '';
      const cardStyle = isFeatured ? 'border: 2px solid var(--color-brand-red); box-shadow: var(--shadow-md);' : '';
      const titleStyle = isFeatured ? 'color: var(--color-brand-red);' : '';

      return \`
        <div class="event-card \${isFeatured ? 'featured-event-card' : ''}" onclick="openEventDetail(\${ev.id})" style="\${cardStyle}">
          <div class="event-img-wrap" style="position: relative;">
            <img src="\${ev.img}" alt="\${ev.title}" class="event-img" loading="lazy">
            <span class="event-badge" style="\${badgeStyle}">\${ev.badge || 'Sự Kiện'}</span>
          </div>
          <div class="event-content">
            <div class="event-date">📅 \${ev.date}</div>
            <h3 class="event-title" style="\${titleStyle}">\${ev.title}</h3>
            <p class="event-desc">\${ev.desc}</p>
            <span class="event-link" style="\${titleStyle} font-weight: 700;">Xem Chi Tiết & Đặt Bàn Nhận Ưu Đãi ↗</span>
          </div>
        </div>
      \`;
    }).join('');
  }
}
`;

const oldDomReady = `document.addEventListener('DOMContentLoaded', () => {
  initDishes();
  renderLookbookGrid();
  renderBranches();
  renderFranchisePackages();
  setupEventListeners();
  setupScrollSpy();
  calculateROI();
});`;

const newDomReady = `document.addEventListener('DOMContentLoaded', () => {
  initDishes();
  loadLiveEvents();
  renderLookbookGrid();
  renderBranches();
  renderFranchisePackages();
  setupEventListeners();
  setupScrollSpy();
  calculateROI();
});`;

let norm = (s) => s.replace(/\r\n/g, '\n');

if (!norm(appJs).includes('function loadLiveEvents')) {
  let updated = norm(appJs).replace(norm(oldDomReady), loadEventsFunction + '\n' + newDomReady);
  fs.writeFileSync('js/app.js', updated.replace(/\n/g, appJs.includes('\r\n') ? '\r\n' : '\n'), 'utf8');
  console.log('✅ Đã tích hợp loadLiveEvents vào js/app.js');
} else {
  console.log('ℹ️ loadLiveEvents đã tồn tại trong js/app.js');
}
