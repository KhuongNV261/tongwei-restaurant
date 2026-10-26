const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../js/app.js');
let js = fs.readFileSync(jsPath, 'utf8');
const isCrlf = js.includes('\r\n');
const eol = isCrlf ? '\r\n' : '\n';

// 1. Mobile toggle replace
const targetMobile = [
  '  // Mobile menu toggle',
  '  if (elements.mobileToggle && elements.navLinks) {',
  '    elements.mobileToggle.addEventListener(\'click\', () => {',
  '      elements.navLinks.classList.toggle(\'mobile-open\');',
  '    });',
  '    // Close mobile menu when clicking a link',
  '    elements.navLinks.querySelectorAll(\'.nav-link\').forEach(link => {',
  '      link.addEventListener(\'click\', () => {',
  '        elements.navLinks.classList.remove(\'mobile-open\');',
  '      });',
  '    });',
  '  }'
].join(eol);

const replacementMobile = [
  '  // Mobile menu toggle with aria-expanded and body scroll lock (RESP-02)',
  '  if (elements.mobileToggle && elements.navLinks) {',
  '    elements.mobileToggle.addEventListener(\'click\', () => {',
  '      const isOpened = elements.navLinks.classList.toggle(\'mobile-open\');',
  '      elements.mobileToggle.setAttribute(\'aria-expanded\', isOpened ? \'true\' : \'false\');',
  '      elements.mobileToggle.setAttribute(\'aria-label\', isOpened ? \'Đóng menu\' : \'Mở menu\');',
  '      document.body.style.overflow = isOpened ? \'hidden\' : \'\';',
  '    });',
  '    // Close mobile menu when clicking a link',
  '    elements.navLinks.querySelectorAll(\'.nav-link\').forEach(link => {',
  '      link.addEventListener(\'click\', () => {',
  '        elements.navLinks.classList.remove(\'mobile-open\');',
  '        elements.mobileToggle.setAttribute(\'aria-expanded\', \'false\');',
  '        elements.mobileToggle.setAttribute(\'aria-label\', \'Mở menu\');',
  '        document.body.style.overflow = \'\';',
  '      });',
  '    });',
  '  }'
].join(eol);

if (js.includes(targetMobile)) {
  js = js.replace(targetMobile, replacementMobile);
  console.log('✅ Mobile toggle replaced successfully.');
} else {
  console.error('❌ targetMobile not found in js/app.js');
}

// 2. ESC key replace
const targetEsc = [
  '  // Keyboard navigation for Master Album Lightbox',
  '  window.addEventListener(\'keydown\', (e) => {',
  '    if (!elements.lightboxModal?.classList.contains(\'active\')) return;',
  '    if (e.key === \'ArrowLeft\') prevAlbumPhoto();',
  '    if (e.key === \'ArrowRight\') nextAlbumPhoto();',
  '    if (e.key === \'Escape\') closeLightboxDirect();',
  '  });'
].join(eol);

const replacementEsc = [
  '  // Global Keyboard Navigation (ESC to close active modals & mobile menu)',
  '  window.addEventListener(\'keydown\', (e) => {',
  '    if (e.key === \'Escape\') {',
  '      if (elements.lightboxModal?.classList.contains(\'active\')) {',
  '        closeLightboxDirect();',
  '      }',
  '      [\'cartModal\', \'dishModal\', \'eventModal\', \'careerModal\'].forEach(id => {',
  '        closeModal(id);',
  '      });',
  '      if (elements.navLinks?.classList.contains(\'mobile-open\')) {',
  '        elements.navLinks.classList.remove(\'mobile-open\');',
  '        elements.mobileToggle?.setAttribute(\'aria-expanded\', \'false\');',
  '        elements.mobileToggle?.setAttribute(\'aria-label\', \'Mở menu\');',
  '        document.body.style.overflow = \'\';',
  '      }',
  '    }',
  '    if (elements.lightboxModal?.classList.contains(\'active\')) {',
  '      if (e.key === \'ArrowLeft\') prevAlbumPhoto();',
  '      if (e.key === \'ArrowRight\') nextAlbumPhoto();',
  '    }',
  '  });'
].join(eol);

if (js.includes(targetEsc)) {
  js = js.replace(targetEsc, replacementEsc);
  console.log('✅ ESC logic replaced successfully.');
} else {
  console.error('❌ targetEsc not found in js/app.js');
}

// 3. ScrollSpy function & DOMContentLoaded
const scrollSpyCode = [
  '// ScrollSpy: Automatically highlight active navbar link on scroll',
  'function setupScrollSpy() {',
  '  const sections = document.querySelectorAll(\'section[id], header[id]\');',
  '  const navLinksList = document.querySelectorAll(\'.nav-links .nav-link\');',
  '  if (!sections.length || !navLinksList.length) return;',
  '',
  '  window.addEventListener(\'scroll\', () => {',
  '    let currentId = \'\';',
  '    const scrollPosition = window.scrollY + 140;',
  '',
  '    sections.forEach(section => {',
  '      const top = section.offsetTop;',
  '      const height = section.offsetHeight;',
  '      if (scrollPosition >= top && scrollPosition < top + height) {',
  '        currentId = section.getAttribute(\'id\');',
  '      }',
  '    });',
  '',
  '    if (currentId) {',
  '      navLinksList.forEach(link => {',
  '        link.classList.remove(\'active\');',
  '        if (link.getAttribute(\'href\') === \'#\' + currentId) {',
  '          link.classList.add(\'active\');',
  '        }',
  '      });',
  '    }',
  '  }, { passive: true });',
  '}',
  ''
].join(eol);

if (!js.includes('function setupScrollSpy()')) {
  js = js.replace(
    '// Initialize everything on DOMContentLoaded',
    scrollSpyCode + '// Initialize everything on DOMContentLoaded'
  );
  js = js.replace(
    '  setupEventListeners();',
    '  setupEventListeners();' + eol + '  setupScrollSpy();'
  );
  console.log('✅ ScrollSpy added successfully.');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Checking syntax with node -c...');
require('child_process').execSync('node -c js/app.js');
console.log('✅ Syntax valid!');
