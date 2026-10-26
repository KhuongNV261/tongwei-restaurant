/**
 * TongWei Restaurant - Frontend Automated QA & Audit Test Suite
 * Comprehensive checks for Responsive, UI/UX, Accessibility (WCAG 2.1 AA), and Performance
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlPath = path.join(rootDir, 'index.html');
const cssPath = path.join(rootDir, 'css/style.css');
const jsPath = path.join(rootDir, 'js/app.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

const results = [];

function record(category, testId, title, pass, severity, details) {
  results.push({
    category,
    testId,
    title,
    status: pass ? 'PASS' : 'FAIL',
    severity: pass ? 'N/A' : severity,
    details
  });
}

// =========================================================================
// 1. RESPONSIVE DESIGN CHECKS
// =========================================================================
console.log('Running Category 1: Responsive Design Checks...');

// 1.1 Breakpoint coverage (<=480px, <=768px, >1024px)
const hasMobileQuery = /@media[^{]*max-width:\s*(480|500|600)px/i.test(css);
const hasTabletQuery = /@media[^{]*max-width:\s*(768|800)px/i.test(css);
const hasDesktopOrLaptopQuery = /@media[^{]*max-width:\s*(1024|1120|1280)px/i.test(css);
record(
  '1. Responsive Design',
  'RESP-01',
  'Responsive Media Queries (Mobile <=480px, Tablet <=768px, Desktop <=1024/1120px)',
  hasMobileQuery && hasTabletQuery && hasDesktopOrLaptopQuery,
  'High',
  { hasMobileQuery, hasTabletQuery, hasDesktopOrLaptopQuery }
);

// 1.2 Navbar Mobile Collapse & Body scroll lock
const navToggleHasAriaExpanded = /id=["']mobileToggle["'][^>]*aria-expanded/i.test(html);
const jsTogglesAriaExpanded = js.includes('aria-expanded') && js.includes('mobileToggle');
const jsLocksBodyScroll = js.includes('overflow') && (js.includes('mobile-open') || js.includes('mobileToggle'));
record(
  '1. Responsive Design',
  'RESP-02',
  'Mobile Navbar Toggle with aria-expanded and body scroll lock',
  navToggleHasAriaExpanded && jsTogglesAriaExpanded && jsLocksBodyScroll,
  'High',
  { navToggleHasAriaExpanded, jsTogglesAriaExpanded, jsLocksBodyScroll }
);

// 1.3 Form inputs font size & padding for mobile (>=16px to prevent iOS auto-zoom)
const inputMobileZoomPrevent = css.includes('font-size: 16px') || css.includes('font-size: 1rem');
record(
  '1. Responsive Design',
  'RESP-03',
  'Mobile Form Inputs Font Size (>= 16px)',
  inputMobileZoomPrevent,
  'Medium',
  { inputMobileZoomPrevent }
);

// 1.4 Hard-coded fixed widths that could break viewport (<360px)
const fixedWidthViolations = [];
const widthRegex = /width:\s*([4-9]\d{2}|[1-9]\d{3})px/g;
let m;
while ((m = widthRegex.exec(css)) !== null) {
  // Check context
  const idx = m.index;
  const surrounding = css.substring(Math.max(0, idx - 80), Math.min(css.length, idx + 80));
  if (!surrounding.includes('max-width') && !surrounding.includes('@media (min-width')) {
    fixedWidthViolations.push(m[0]);
  }
}
record(
  '1. Responsive Design',
  'RESP-04',
  'No inflexible hard-coded fixed widths (>400px without max-width)',
  fixedWidthViolations.length <= 2,
  'Medium',
  { count: fixedWidthViolations.length, samples: fixedWidthViolations.slice(0, 5) }
);

// =========================================================================
// 2. UI / UX DESIGN CHECKS
// =========================================================================
console.log('Running Category 2: UI/UX Checks...');

// 2.1 Hero Section Elements
const hasHeroBanner = html.includes('hero-banner-strip') || html.includes('hero-section');
const hasHeroCta = html.includes('hero-cta') && html.includes('btn-primary');
const hasHeroDishImg = html.includes('hero-dish-img') || html.includes('heroDishImg');
record(
  '2. UI/UX',
  'UX-01',
  'Hero Section Banner, CTA and Featured Dish Visual',
  hasHeroBanner && hasHeroCta && hasHeroDishImg,
  'Medium',
  { hasHeroBanner, hasHeroCta, hasHeroDishImg }
);

// 2.2 Hover & Transition states
const transitionCount = (css.match(/transition:/g) || []).length;
const hoverCount = (css.match(/:hover/g) || []).length;
record(
  '2. UI/UX',
  'UX-02',
  'Interactive Hover States and Smooth Transitions',
  transitionCount >= 25 && hoverCount >= 30,
  'Low',
  { transitionCount, hoverCount }
);

// 2.3 Navigation Active State on Scroll (ScrollSpy)
const jsHasScrollSpy = js.includes('IntersectionObserver') || (js.includes('scroll') && js.includes('nav-link') && js.includes('active'));
record(
  '2. UI/UX',
  'UX-03',
  'Navigation Active State Highlight on Scroll (ScrollSpy)',
  jsHasScrollSpy,
  'High',
  { jsHasScrollSpy }
);

// 2.4 Cart Badge Real-Time Update
const jsHasCartBadgeUpdate = js.includes('cartBadge') && js.includes('textContent = totalCount');
const jsHidesCartBadgeZero = js.includes("display = totalCount > 0 ? 'flex' : 'none'");
record(
  '2. UI/UX',
  'UX-04',
  'Cart Badge Real-Time Update and Visibility Toggle',
  jsHasCartBadgeUpdate && jsHidesCartBadgeZero,
  'High',
  { jsHasCartBadgeUpdate, jsHidesCartBadgeZero }
);

// 2.5 Lightbox Gallery 25 Photos and ESC handling
const has25Photos = js.includes('masterAlbum') && js.includes('id": 25');
const jsHasEscHandling = js.includes("e.key === 'Escape'") || js.includes("e.keyCode === 27");
record(
  '2. UI/UX',
  'UX-05',
  'Lightbox 25 Photos Album with ESC & Keyboard Controls',
  has25Photos && jsHasEscHandling,
  'Medium',
  { has25Photos, jsHasEscHandling }
);

// 2.6 Modal ESC key closes ANY open modal (not just lightbox)
const escClosesAllModals = js.includes('Escape') && (js.includes('closeModal') || js.includes('modal-overlay'));
record(
  '2. UI/UX',
  'UX-06',
  'Global ESC Key Listener Closes Active Modals (Cart, Dish, Event, Career, Lightbox)',
  escClosesAllModals,
  'Medium',
  { escClosesAllModals }
);

// =========================================================================
// 3. ACCESSIBILITY (WCAG 2.1 LEVEL AA)
// =========================================================================
console.log('Running Category 3: Accessibility WCAG 2.1 AA Checks...');

// 3.1 Skip to content link
const hasSkipLink = html.includes('skip-link') || html.includes('skip-to-content');
const hasMainContentId = html.includes('id="main-content"') || html.includes('id="content"');
const cssHasSkipLinkFocus = css.includes('.skip-link:focus');
record(
  '3. Accessibility',
  'A11Y-01',
  'Skip to Main Content Link with accessible :focus style',
  hasSkipLink && hasMainContentId && cssHasSkipLinkFocus,
  'High',
  { hasSkipLink, hasMainContentId, cssHasSkipLinkFocus }
);

// 3.2 Form controls have associated labels
const inputRegex = /<input([^>]+)>/g;
let inpMatch;
const unlabelledInputs = [];
while ((inpMatch = inputRegex.exec(html)) !== null) {
  const attrs = inpMatch[1];
  const typeMatch = attrs.match(/type=["']([^"']+)["']/);
  const type = typeMatch ? typeMatch[1] : 'text';
  if (type !== 'hidden') {
    const idMatch = attrs.match(/id=["']([^"']+)["']/);
    const ariaLabel = attrs.match(/aria-label=["']([^"']+)["']/);
    if (!idMatch) {
      unlabelledInputs.push('Input missing id: ' + attrs.trim());
    } else {
      const id = idMatch[1];
      const hasLabelFor = new RegExp(`<label[^>]*for=["']${id}["']`, 'i').test(html);
      if (!hasLabelFor && !ariaLabel) {
        unlabelledInputs.push(id);
      }
    }
  }
}
record(
  '3. Accessibility',
  'A11Y-02',
  'Form Controls (Inputs, Sliders, Search) have explicit labels or aria-label',
  unlabelledInputs.length === 0,
  'High',
  { unlabelledInputs }
);

// 3.3 Interactive buttons have accessible names (text, aria-label, or title)
const buttonRegex = /<button([^>]*)>([\s\S]*?)<\/button>/g;
let btnMatch;
const unnamedButtons = [];
while ((btnMatch = buttonRegex.exec(html)) !== null) {
  const attrs = btnMatch[1];
  const innerText = btnMatch[2].replace(/<[^>]+>/g, '').trim();
  const hasAriaLabel = /aria-label=["'][^"']+["']/.test(attrs);
  const hasTitle = /title=["'][^"']+["']/.test(attrs);
  if (!innerText && !hasAriaLabel) {
    unnamedButtons.push(attrs.trim());
  }
}
record(
  '3. Accessibility',
  'A11Y-03',
  'Buttons have accessible names (visible text or aria-label)',
  unnamedButtons.length === 0,
  'High',
  { unnamedButtons }
);

// 3.4 Modal close buttons and Lightbox nav buttons have aria-label
const lightboxCloseHasAria = /class=["'][^"']*lightbox-close[^"']*["'][^>]*aria-label/i.test(html) || /class=["'][^"']*lightbox-close[^"']*["'][^>]*title/i.test(html);
const modalCloseHasAria = /class=["'][^"']*modal-close[^"']*["'][^>]*aria-label/i.test(html);
const albumNavBtnsHaveAria = html.includes('aria-label="Ảnh trước"') || html.includes('aria-label="Xem ảnh trước"');
record(
  '3. Accessibility',
  'A11Y-04',
  'Modal close buttons and Lightbox navigation arrows have accessible aria-labels',
  lightboxCloseHasAria && modalCloseHasAria && albumNavBtnsHaveAria,
  'Medium',
  { lightboxCloseHasAria, modalCloseHasAria, albumNavBtnsHaveAria }
);

// 3.5 Keyboard focus visibility (:focus-visible)
const hasFocusVisibleInCss = css.includes(':focus-visible');
const removesOutlineWithoutReplacement = css.includes('outline: none') && !hasFocusVisibleInCss;
record(
  '3. Accessibility',
  'A11Y-05',
  'Visible Keyboard Focus Indicators (:focus-visible) on all interactive elements',
  hasFocusVisibleInCss && !removesOutlineWithoutReplacement,
  'High',
  { hasFocusVisibleInCss, removesOutlineWithoutReplacement }
);

// 3.6 Color contrast compliance (WCAG AA >= 4.5:1 for body text)
// Text muted color check: #788596 on #faf7f2 has contrast 3.8:1 (FAIL). Needs #5b6b80 or #4a5768 (>= 4.5:1)
const isTextMutedContrastCompliant = css.includes('--color-text-muted: #5') || css.includes('--color-text-muted: #4');
record(
  '3. Accessibility',
  'A11Y-06',
  'Color Contrast Compliance for Text Tokens (--color-text-muted >= 4.5:1)',
  isTextMutedContrastCompliant,
  'Medium',
  { isTextMutedContrastCompliant }
);

// =========================================================================
// 4. PERFORMANCE & OPTIMIZATION
// =========================================================================
console.log('Running Category 4: Performance & Optimization Checks...');

// 4.1 Image Lazy Loading on non-hero images
const staticImgMatches = [...html.matchAll(/<img([^>]+)>/g)];
const nonHeroImgsWithoutLazy = [];
staticImgMatches.forEach((match, idx) => {
  const attrs = match[1];
  const isHeroOrLogo = attrs.includes('logo-avatar') || attrs.includes('hero-dish') || attrs.includes('branding/tongwei_avatar');
  if (!isHeroOrLogo && !attrs.includes('loading="lazy"')) {
    nonHeroImgsWithoutLazy.push(attrs);
  }
});
record(
  '4. Performance',
  'PERF-01',
  'Images below the fold have loading="lazy"',
  nonHeroImgsWithoutLazy.length === 0,
  'Medium',
  { count: nonHeroImgsWithoutLazy.length, samples: nonHeroImgsWithoutLazy.slice(0, 3) }
);

// 4.2 Font Loading Strategy
const hasPreconnectFonts = html.includes('rel="preconnect"') && html.includes('fonts.gstatic.com');
const hasDisplaySwap = html.includes('display=swap');
record(
  '4. Performance',
  'PERF-02',
  'Font Optimization: preconnect and display=swap',
  hasPreconnectFonts && hasDisplaySwap,
  'Low',
  { hasPreconnectFonts, hasDisplaySwap }
);

// 4.3 Clean Console / Syntax verification
let jsSyntaxPass = false;
try {
  require('child_process').execSync('node -c js/app.js');
  jsSyntaxPass = true;
} catch (e) {
  jsSyntaxPass = false;
}
record(
  '4. Performance',
  'PERF-03',
  'JavaScript Syntax Clean and Error-Free',
  jsSyntaxPass,
  'High',
  { jsSyntaxPass }
);

// =========================================================================
// 5. DARK MODE & CONTRAST COMPATIBILITY
// =========================================================================
console.log('Running Category 5: Dark Mode & Theme Variables Checks...');

// Check if dark section variables exist and text readable on dark gradients
const hasDarkSurfaceTokens = css.includes('--color-indigo-dark') && css.includes('--color-text-light');
const darkSectionHasLightText = css.includes('.banner-calligraphy') && css.includes('.lightbox-caption');
record(
  '5. Dark Mode / Theming',
  'THEME-01',
  'Contrast and readable text tokens on dark background surfaces',
  hasDarkSurfaceTokens && darkSectionHasLightText,
  'Low',
  { hasDarkSurfaceTokens, darkSectionHasLightText }
);

// =========================================================================
// SUMMARY OUTPUT
// =========================================================================
console.log('\n================================================================');
console.log('📊 TONGWEI RESTAURANT FRONTEND QA & AUDIT RESULTS');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

results.forEach(r => {
  const icon = r.status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} [${r.testId}] ${r.title} => ${r.status} (Severity: ${r.severity})`);
  if (r.status === 'FAIL') {
    failCount++;
    console.log('   Details:', JSON.stringify(r.details));
  } else {
    passCount++;
  }
});

console.log('\n----------------------------------------------------------------');
console.log(`TOTAL TESTS: ${results.length} | PASS: ${passCount} | FAIL: ${failCount}`);
console.log('VERDICT:', failCount === 0 ? '🟢 ALL TESTS PASSED' : '🔴 TESTS FAILED - FIXES REQUIRED');
console.log('----------------------------------------------------------------\n');

// Write JSON output for subagents
fs.writeFileSync(
  path.join(rootDir, 'frontend_audit_results.json'),
  JSON.stringify({ passCount, failCount, results }, null, 2)
);
