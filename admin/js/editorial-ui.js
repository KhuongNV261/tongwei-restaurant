// Editorial data is plain text. Construct nodes so content never becomes markup.
export function node(tag, className = '', text = '') {
  const item = document.createElement(tag);
  if (className) item.className = className;
  item.textContent = text;
  return item;
}

export function button(label, action, style = 'btn-outline') {
  const item = node('button', 'btn ' + style, label);
  item.type = 'button';
  item.addEventListener('click', action);
  return item;
}

export function safeUrl(value) {
  const raw = String(value || '').trim();
  if (!raw || raw.length > 2048 || /[\\<>"'`\u0000-\u001f\u007f]/.test(raw) || /^(?:\/\/|[?#])/.test(raw)) return '';
  try {
    const url = new URL(raw, location.origin + '/');
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return '';
    return url.href;
  } catch {
    return '';
  }
}

export function field(label, name, value = '', kind = 'text', required = false) {
  const wrap = node('label', 'cms-field', label);
  const input = node(kind === 'long' ? 'textarea' : 'input');
  input.name = name;
  input.value = value ?? '';
  input.required = required;
  if (kind === 'long') input.rows = 3;
  else input.type = kind === 'url' ? 'text' : kind;
  if (kind === 'url') {
    input.inputMode = 'url';
    input.spellcheck = false;
    input.placeholder = '/assets/images/… hoặc https://…';
  }
  function validate() {
    const unsafe = kind === 'url' && input.value.trim() && !safeUrl(input.value);
    const blank = required && !input.value.trim();
    input.setCustomValidity(unsafe ? 'Nhập đường dẫn ảnh hoặc liên kết HTTP(S) hợp lệ.' : blank ? 'Vui lòng điền mục này.' : '');
  }
  validate();
  input.addEventListener('input', validate);
  wrap.append(input);
  return wrap;
}

export function thumbnail(value, alt) {
  const src = safeUrl(value);
  if (!src) return null;
  const img = node('img', 'cms-thumb');
  img.alt = alt;
  img.loading = 'lazy';
  img.referrerPolicy = 'no-referrer';
  img.src = src;
  return img;
}
