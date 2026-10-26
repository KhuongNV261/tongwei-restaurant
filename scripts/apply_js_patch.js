const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const jsPath = path.join(rootDir, 'js/app.js');

let js = fs.readFileSync(jsPath, 'utf8');

// Replace mobile toggle logic using Regex that is agnostic of \r\n vs \n
const mobileToggleRegex = /\/\/\s*Mobile menu toggle[\s\S]*?if\s*\(\s*elements\.mobileToggle\s*&&\s*elements\.navLinks\s*\)\s*\{[\s\S]*?elements\.navLinks\.classList\.toggle\('mobile-open'\);[\s\S]*?elements\.navLinks\.classList\.remove\('mobile-open'\);[\s\S]*?\}\s*\);\s*\}\s*\}/;

const newMobileToggle = `  // Mobile menu toggle with aria-expanded and body scroll lock (RESP-02)
  if (elements.mobileToggle && elements.navLinks) {
    elements.mobileToggle.addEventListener('click', () => {
      const isOpened = elements.navLinks.classList.toggle('mobile-open');
      elements.mobileToggle.setAttribute('aria-expanded', isOpened ? 'true' : 'false');
      elements.mobileToggle.setAttribute('aria-label', isOpened ? 'Đóng menu' : 'Mở menu');
      document.body.style.overflow = isOpened ? 'hidden' : '';
    });
    // Close mobile menu when clicking a link
    elements.navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        elements.navLinks.classList.remove('mobile-open');
        elements.mobileToggle.setAttribute('aria-expanded', 'false');
        elements.mobileToggle.setAttribute('aria-label', 'Mở menu');
        document.body.style.overflow = '';
      });
    });
  }`;

if (mobileToggleRegex.test(js)) {
  js = js.replace(mobileToggleRegex, newMobileToggle);
  console.log('Mobile toggle replaced via Regex!');
} else {
  console.log('Mobile toggle regex did not match, trying alternative replace');
}

// Replace ESC key logic using Regex
const escRegex = /\/\/\s*Keyboard navigation for Master Album Lightbox[\s\S]*?window\.addEventListener\('keydown',\s*\(e\)\s*=>\s*\{[\s\S]*?if\s*\(!elements\.lightboxModal\?\.classList\.contains\('active'\)\)\s*return;[\s\S]*?if\s*\(e\.key\s*===\s*'Escape'\)\s*closeLightboxDirect\(\);[\s\S]*?\}\);/;

const newEscLogic = `  // Global Keyboard Navigation (ESC closes active modals & mobile menu)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (elements.lightboxModal?.classList.contains('active')) {
        closeLightboxDirect();
      }
      ['cartModal', 'dishModal', 'eventModal', 'careerModal'].forEach(id => {
        closeModal(id);
      });
      if (elements.navLinks?.classList.contains('mobile-open')) {
        elements.navLinks.classList.remove('mobile-open');
        elements.mobileToggle?.setAttribute('aria-expanded', 'false');
        elements.mobileToggle?.setAttribute('aria-label', 'Mở menu');
        document.body.style.overflow = '';
      }
    }
    if (elements.lightboxModal?.classList.contains('active')) {
      if (e.key === 'ArrowLeft') prevAlbumPhoto();
      if (e.key === 'ArrowRight') nextAlbumPhoto();
    }
  });`;

if (escRegex.test(js)) {
  js = js.replace(escRegex, newEscLogic);
  console.log('ESC logic replaced via Regex!');
}

// ScrollSpy implementation
const scrollSpyCode = `
// ScrollSpy: Automatically highlight active navbar link on scroll
function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinksList = document.querySelectorAll('.nav-links .nav-link');
  if (!sections.length || !navLinksList.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinksList.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentId) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}
`;

if (!js.includes('function setupScrollSpy()')) {
  js = js.replace(
    '// Initialize everything on DOMContentLoaded',
    scrollSpyCode + '\r\n// Initialize everything on DOMContentLoaded'
  );
  js = js.replace(
    'setupEventListeners();',
    'setupEventListeners();\r\n  setupScrollSpy();'
  );
  console.log('ScrollSpy added!');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Patch complete.');
