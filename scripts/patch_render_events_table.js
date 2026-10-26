const fs = require('fs');

let adminJs = fs.readFileSync('admin/js/admin.js', 'utf8');

const targetStr = `function renderEventsTable() {
  const tbody = document.getElementById('eventsTbody');
  if (!tbody) return;

  tbody.innerHTML = adminState.events.map(ev => {
    const imgSrc = ev.img.startsWith('assets') ? \`../\${ev.img}\` : ev.img;
    return \`
      <tr>
        <td>
          <img src="\${imgSrc}" alt="\${ev.title}" style="width: 70px; height: 45px; object-fit: cover; border-radius: var(--radius-sm);">
        </td>
        <td>
          <div style="font-weight: 700; color: var(--color-indigo-dark); font-size: 0.95rem;">\${ev.title}</div>
        </td>
        <td>\${ev.date}</td>
        <td><span class="badge badge-success">\${ev.badge}</span></td>
        <td style="max-width: 280px; font-size: 0.85rem; color: var(--text-secondary);">\${ev.desc}</td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 0.4rem; justify-content: flex-end;">
            <button class="btn btn-outline btn-sm" onclick="editEvent(\${ev.id})">✏️ Sửa</button>
            <button class="btn btn-danger btn-sm" onclick="deleteEvent(\${ev.id})">🗑️</button>
          </div>
        </td>
      </tr>
    \`;
  }).join('');
}`;

const replacementStr = `function renderEventsTable() {
  const tbody = document.getElementById('eventsTbody');
  if (!tbody) return;

  const today = new Date().toISOString().split('T')[0];

  tbody.innerHTML = adminState.events.map(ev => {
    const imgSrc = ev.img.startsWith('assets') ? \`../\${ev.img}\` : ev.img;
    const isHidden = ev.status === 'hidden';
    const hasEndDate = ev.end_date && ev.end_date.trim() !== '';
    const isExpired = hasEndDate && (today > ev.end_date.trim());

    let statusHtml = '';
    if (isHidden) {
      statusHtml = '<span class="badge" style="background: #e2e8f0; color: #475569; padding: 0.25rem 0.5rem;">⚪ Đang ẩn</span>';
    } else if (isExpired) {
      statusHtml = \`<span class="badge" style="background: #fee2e2; color: #dc2626; padding: 0.25rem 0.5rem;" title="Đã qua ngày kết thúc \${ev.end_date}">⏰ Hết hạn (Tự ẩn)</span>\`;
    } else if (hasEndDate) {
      statusHtml = \`<span class="badge badge-success" style="padding: 0.25rem 0.5rem;" title="Hiển thị đến hết ngày \${ev.end_date}">🟢 Đang hiện (Đến \${ev.end_date})</span>\`;
    } else {
      statusHtml = '<span class="badge badge-success" style="padding: 0.25rem 0.5rem;" title="Luôn hiển thị (Không giới hạn ngày)">🟢 Luôn hiển thị</span>';
    }

    const toggleBtnText = isHidden ? '👁️ Hiện' : '👁️‍🗨️ Ẩn';
    const toggleBtnStyle = isHidden 
      ? 'background: #f1f5f9; color: #0284c7; border: 1px solid #cbd5e1;' 
      : 'background: #fff; color: #64748b; border: 1px solid #e2e8f0;';

    return \`
      <tr style="\${(isHidden || isExpired) ? 'opacity: 0.75; background: #fafafa;' : ''}">
        <td>
          <img src="\${imgSrc}" alt="\${ev.title}" style="width: 70px; height: 45px; object-fit: cover; border-radius: var(--radius-sm);">
        </td>
        <td>
          <div style="font-weight: 700; color: var(--color-indigo-dark); font-size: 0.95rem;">\${ev.title}</div>
          \${hasEndDate ? \`<small style="color: #64748b; font-size: 0.78rem;">Hạn đến: <b>\${ev.end_date}</b></small>\` : '<small style="color: #10b981; font-size: 0.78rem;">Vô thời hạn</small>'}
        </td>
        <td>\${ev.date}</td>
        <td><span class="badge badge-success">\${ev.badge}</span></td>
        <td>\${statusHtml}</td>
        <td style="max-width: 240px; font-size: 0.85rem; color: var(--text-secondary);">\${ev.desc}</td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end; align-items: center;">
            <button class="btn btn-sm" style="\${toggleBtnStyle}" onclick="toggleEventStatus(\${ev.id})" title="\${isHidden ? 'Bấm để Hiện sự kiện' : 'Bấm để Ẩn sự kiện'}">\${toggleBtnText}</button>
            <button class="btn btn-outline btn-sm" onclick="editEvent(\${ev.id})">✏️ Sửa</button>
            <button class="btn btn-danger btn-sm" onclick="deleteEvent(\${ev.id})">🗑️</button>
          </div>
        </td>
      </tr>
    \`;
  }).join('');
}

window.toggleEventStatus = async function(id) {
  const ev = adminState.events.find(e => e.id === id);
  if (!ev) return;

  ev.status = (ev.status === 'hidden') ? 'active' : 'hidden';
  localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
  renderEventsTable();

  const msg = (ev.status === 'active') ? \`Đã BẬT hiển thị sự kiện "\${ev.title}"!\` : \`Đã ẨN sự kiện "\${ev.title}" khỏi website!\`;
  showToast(msg, ev.status === 'active' ? 'success' : 'warning');

  // Cập nhật lên Cloudflare D1
  fetch('/api/events', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: ev.id, status: ev.status })
  }).catch(e => {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ev)
    }).catch(err => console.warn('Sync status failed:', err));
  });
};`;

let norm = s => s.replace(/\r\n/g, '\n');
let normAdmin = norm(adminJs);
let normTarget = norm(targetStr);

if (normAdmin.includes(normTarget)) {
  normAdmin = normAdmin.replace(normTarget, norm(replacementStr));
  fs.writeFileSync('admin/js/admin.js', normAdmin.replace(/\n/g, adminJs.includes('\r\n') ? '\r\n' : '\n'), 'utf8');
  console.log('✅ Đã cập nhật thành công renderEventsTable & toggleEventStatus trong admin/js/admin.js');
} else {
  console.log('❌ Không tìm thấy targetStr');
}
