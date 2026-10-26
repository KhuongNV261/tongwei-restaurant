const fs = require('fs');

const css = fs.readFileSync('css/style.css', 'utf8');

console.log('=== CSS RESPONSIVE & LAYOUT AUDIT ===\n');

// 1. overflow-x occurrences
console.log('--- 1. OVERFLOW-X USAGE ---');
const overflowMatches = [...css.matchAll(/([^{}]+)\{[^}]*overflow(-x)?\s*:\s*hidden[^}]*\}/g)];
overflowMatches.forEach(m => {
  console.log(`Selector: ${m[1].trim().replace(/\s+/g, ' ')}`);
});

// 2. Fixed widths / min-widths >= 320px
console.log('\n--- 2. FIXED / HARD MIN-WIDTHS >= 320px ---');
// Let's find rules with width or min-width in px
const ruleRegex = /([^{}]+)\{([^}]+)\}/g;
let match;
const fixedWidths = [];
while ((match = ruleRegex.exec(css)) !== null) {
  const selector = match[1].trim().replace(/\s+/g, ' ');
  const body = match[2];
  
  // check width / min-width: Npx where N >= 320
  const widthMatch = body.match(/(^|;)\s*(min-width|width)\s*:\s*(\d+)px/);
  if (widthMatch) {
    const prop = widthMatch[2];
    const val = parseInt(widthMatch[3], 10);
    if (val >= 320 && !selector.startsWith('@')) {
      fixedWidths.push({ selector, prop, val, body: body.trim().replace(/\s+/g, ' ') });
    }
  }
}
fixedWidths.forEach(fw => {
  console.log(`  ${fw.prop}: ${fw.val}px in "${fw.selector}"`);
});

// 3. Media queries analysis
console.log('\n--- 3. MEDIA QUERY BREAKPOINTS ---');
const mqRegex = /@media[^{]+\{/g;
const mqs = [...css.matchAll(mqRegex)];
const breakpoints = {};
mqs.forEach(m => {
  const text = m[0].trim();
  breakpoints[text] = (breakpoints[text] || 0) + 1;
});
Object.entries(breakpoints).forEach(([bp, count]) => {
  console.log(`  ${bp} (Count: ${count})`);
});

// 4. Flex containers without flex-wrap
console.log('\n--- 4. FLEX CONTAINERS WITHOUT FLEX-WRAP ---');
let flexWithoutWrap = [];
while ((match = ruleRegex.exec(css)) !== null) {
  const selector = match[1].trim().replace(/\s+/g, ' ');
  const body = match[2];
  if (/display\s*:\s*(inline-)?flex/.test(body) && !/flex-wrap\s*:\s*(wrap|wrap-reverse)/.test(body)) {
    // Check if it's within mobile or general
    flexWithoutWrap.push(selector);
  }
}
console.log(`Total flex rules without flex-wrap: ${flexWithoutWrap.length}`);
// Let's filter some key UI components that might overflow
const keyFlex = flexWithoutWrap.filter(s => 
  s.includes('nav') || s.includes('hero') || s.includes('modal') || 
  s.includes('card') || s.includes('tab') || s.includes('btn') || s.includes('footer')
);
keyFlex.slice(0, 15).forEach(s => console.log(`  ${s}`));
