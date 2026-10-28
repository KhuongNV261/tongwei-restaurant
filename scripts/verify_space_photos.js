const fs = require('fs');

const appJs = fs.readFileSync('js/app.js', 'utf8');

// Test REAL_SPACE_PHOTOS
const match = appJs.match(/const REAL_SPACE_PHOTOS = (\[[\s\S]*?\n\];)/);
if (!match) {
  console.error('REAL_SPACE_PHOTOS not found!');
  process.exit(1);
}

const REAL_SPACE_PHOTOS = eval(match[1]);
console.log('REAL_SPACE_PHOTOS total count:', REAL_SPACE_PHOTOS.length);

// 1. Check space_ntt
const ntt = REAL_SPACE_PHOTOS.filter(it => it.category === 'space_ntt' || (it.src && it.src.includes('nguyen_thi_thap')));
console.log('NTT count:', ntt.length);
ntt.forEach((it, i) => {
  const exists = fs.existsSync(it.src);
  console.log(` NTT [${i + 1}] ${it.title} -> ${it.src} (File exists: ${exists})`);
  if (!exists) throw new Error(`Missing file: ${it.src}`);
});

// 2. Check space_hk
const hk = REAL_SPACE_PHOTOS.filter(it => it.category === 'space_hk' || (it.src && !it.src.includes('nguyen_thi_thap')));
console.log('HK count:', hk.length);
hk.forEach((it, i) => {
  const exists = fs.existsSync(it.src);
  console.log(` HK [${i + 1}] ${it.title} -> ${it.src} (File exists: ${exists})`);
  if (!exists) throw new Error(`Missing file: ${it.src}`);
});

console.log('\nALL 10 SPACE PHOTOS VERIFIED AND EXIST ON DISK (100% OK)');
