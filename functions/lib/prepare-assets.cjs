// Wrangler and Pages upload only this generated directory.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const output = path.join(root, 'node_modules/.cache/tongwei-public');
fs.mkdirSync(output, { recursive: true });
if (fs.realpathSync(output) !== path.join(fs.realpathSync(root), 'node_modules', '.cache', 'tongwei-public')) {
  throw new Error('Unexpected static build directory');
}
fs.mkdirSync(path.join(output, 'data'), { recursive: true });
const keep = new Set(['data']);
function copy(relative) {
  const source = path.join(root, relative);
  const target = path.join(output, relative);
  const stat = fs.lstatSync(source);
  if (path.basename(source).startsWith('.') || stat.isSymbolicLink()) return;
  keep.add(relative);
  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const child of fs.readdirSync(source)) copy(path.join(relative, child));
  } else {
    fs.copyFileSync(source, target);
  }
}
for (const name of ['index.html', 'assets', 'admin', 'css', 'js', 'data/dishes.json', 'data/site.json']) {
  if (name === 'data/site.json' && !fs.existsSync(path.join(root, name))) continue;
  copy(path.normalize(name));
}

// Keep the watched output directory in place during wrangler dev rebuilds.
for (const relative of fs.readdirSync(output, { recursive: true }).reverse()) {
  if (keep.has(relative)) continue;
  const file = path.join(output, relative);
  if (fs.lstatSync(file).isDirectory()) fs.rmdirSync(file);
  else fs.unlinkSync(file);
}
