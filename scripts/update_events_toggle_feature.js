const fs = require('fs');

console.log('--- 1. Nâng cấp admin/js/admin.js ---');
let adminJs = fs.readFileSync('admin/js/admin.js', 'utf8');

// Định nghĩa hàm renderEventsTable mới có cột Trạng thái & nút Toggle
const newRenderEventsTable = `function renderEventsTable() {
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
      statusHtml = '<span class="badge" style="background: #e2e8f0; color: #475569;">⚪ Đang ẩn</span>';
    } else if (isExpired) {
      statusHtml = \`<span class="badge" style="background: #fee2e2; color: #dc2626;" title="Đã qua ngày kết thúc \${ev.end_date}">⏰ Hết hạn (Tự ẩn)</span>\`;
    } else if (hasEndDate) {
      statusHtml = \`<span class="badge badge-success" title="Hiển thị đến hết ngày \${ev.end_date}">🟢 Đang hiện (Đến \${ev.end_date})</span>\`;
    } else {
      statusHtml = '<span class="badge badge-success" title="Luôn hiển thị (Không giới hạn ngày)">🟢 Luôn hiển thị</span>';
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
          \${hasEndDate ? \`<small style="color: #64748b; font-size: 0.78rem;">Hết hạn: <b>\${ev.end_date}</b></small>\` : '<small style="color: #10b981; font-size: 0.78rem;">Vô thời hạn</small>'}
        </td>
        <td>\${ev.date}</td>
        <td><span class="badge badge-success">\${ev.badge}</span></td>
        <td>\${statusHtml}</td>
        <td style="max-width: 250px; font-size: 0.85rem; color: var(--text-secondary);">\${ev.desc}</td>
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
    // Fallback POST nếu PATCH không hỗ trợ
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ev)
    }).catch(err => console.warn('Sync status failed:', err));
  });
};`;

// Cập nhật openEventModal
const oldOpenEventModal = `function openEventModal(editId = null) {
  const form = document.getElementById('eventForm');
  form.reset();
  const idInput = document.getElementById('eventEditId');
  const title = document.getElementById('eventModalTitle');

  if (editId) {
    const ev = adminState.events.find(e => e.id === editId);
    if (!ev) return;
    title.textContent = 'Chỉnh Sửa Sự Kiện';
    idInput.value = ev.id;
    document.getElementById('eventTitle').value = ev.title;
    document.getElementById('eventDate').value = ev.date;
    document.getElementById('eventBadge').value = ev.badge;
    document.getElementById('eventImg').value = ev.img;
    document.getElementById('eventDesc').value = ev.desc;
    document.getElementById('eventDetail').value = ev.detail || '';
  } else {
    title.textContent = 'Đăng Sự Kiện Mới';
    idInput.value = '';
    document.getElementById('eventImg').value = 'assets/images/concept/concept_10.jpg';
    document.getElementById('eventBadge').value = 'Sự Kiện Mới';
  }

  openModal('eventModal');
}`;

const newOpenEventModal = `function openEventModal(editId = null) {
  const form = document.getElementById('eventForm');
  form.reset();
  const idInput = document.getElementById('eventEditId');
  const title = document.getElementById('eventModalTitle');
  const endDateInput = document.getElementById('eventEndDate');
  const statusCheckbox = document.getElementById('eventStatusCheckbox');

  if (editId) {
    const ev = adminState.events.find(e => e.id === editId);
    if (!ev) return;
    title.textContent = 'Chỉnh Sửa Sự Kiện';
    idInput.value = ev.id;
    document.getElementById('eventTitle').value = ev.title;
    document.getElementById('eventDate').value = ev.date;
    document.getElementById('eventBadge').value = ev.badge;
    document.getElementById('eventImg').value = ev.img;
    document.getElementById('eventDesc').value = ev.desc;
    document.getElementById('eventDetail').value = ev.detail || '';
    if (endDateInput) endDateInput.value = ev.end_date || ev.endDate || '';
    if (statusCheckbox) statusCheckbox.checked = (ev.status !== 'hidden');
  } else {
    title.textContent = 'Đăng Sự Kiện Mới';
    idInput.value = '';
    document.getElementById('eventImg').value = 'assets/images/concept/concept_10.jpg';
    document.getElementById('eventBadge').value = 'Sự Kiện Mới';
    if (endDateInput) endDateInput.value = '';
    if (statusCheckbox) statusCheckbox.checked = true;
  }

  openModal('eventModal');
}`;

// Cập nhật submit form listener
const oldSubmitListener = `  const editId = document.getElementById('eventEditId').value;
  const title = document.getElementById('eventTitle').value.trim();
  const date = document.getElementById('eventDate').value.trim();
  const badge = document.getElementById('eventBadge').value.trim();
  const img = document.getElementById('eventImg').value.trim();
  const desc = document.getElementById('eventDesc').value.trim();
  const detail = document.getElementById('eventDetail').value.trim();

  let targetEvent = null;
  if (editId) {
    const ev = adminState.events.find(e => e.id == editId);
    if (ev) {
      ev.title = title;
      ev.date = date;
      ev.badge = badge;
      ev.img = img;
      ev.desc = desc;
      ev.detail = detail;
      targetEvent = ev;
      showToast(\`Đã cập nhật sự kiện <b>\${title}</b>!\`);
    }
  } else {
    targetEvent = {
      id: Date.now(),
      title,
      date,
      badge,
      img,
      desc,
      detail,
      status: 'active'
    };
    adminState.events.unshift(targetEvent);
    showToast(\`Đã đăng sự kiện mới <b>\${title}</b>!\`);
  }`;

const newSubmitListener = `  const editId = document.getElementById('eventEditId').value;
  const title = document.getElementById('eventTitle').value.trim();
  const date = document.getElementById('eventDate').value.trim();
  const badge = document.getElementById('eventBadge').value.trim();
  const img = document.getElementById('eventImg').value.trim();
  const desc = document.getElementById('eventDesc').value.trim();
  const detail = document.getElementById('eventDetail').value.trim();
  const endDate = document.getElementById('eventEndDate') ? document.getElementById('eventEndDate').value.trim() : '';
  const status = (document.getElementById('eventStatusCheckbox') && !document.getElementById('eventStatusCheckbox').checked) ? 'hidden' : 'active';

  let targetEvent = null;
  if (editId) {
    const ev = adminState.events.find(e => e.id == editId);
    if (ev) {
      ev.title = title;
      ev.date = date;
      ev.badge = badge;
      ev.img = img;
      ev.desc = desc;
      ev.detail = detail;
      ev.end_date = endDate;
      ev.status = status;
      targetEvent = ev;
      showToast(\`Đã cập nhật sự kiện <b>\${title}</b>!\`);
    }
  } else {
    targetEvent = {
      id: Date.now(),
      title,
      date,
      badge,
      img,
      desc,
      detail,
      end_date: endDate,
      status: status
    };
    adminState.events.unshift(targetEvent);
    showToast(\`Đã đăng sự kiện mới <b>\${title}</b>!\`);
  }`;

// Thay thế các đoạn trong adminJs
let norm = s => s.replace(/\r\n/g, '\n');
let normAdmin = norm(adminJs);

// Thay thế renderEventsTable
const renderTableOldRegex = /function renderEventsTable\(\) \{[\s\S]*?tbody\.innerHTML = adminState\.events\.map[\s\S]*?\}\.join\(''\);\s*\}/;
if (renderTableOldRegex.test(normAdmin)) {
  normAdmin = normAdmin.replace(renderTableOldRegex, newRenderEventsTable);
  console.log('✅ Đã cập nhật renderEventsTable & toggleEventStatus.');
}

if (normAdmin.includes(norm(oldOpenEventModal))) {
  normAdmin = normAdmin.replace(norm(oldOpenEventModal), newOpenEventModal);
  console.log('✅ Đã cập nhật openEventModal.');
}

if (normAdmin.includes(norm(oldSubmitListener))) {
  normAdmin = normAdmin.replace(norm(oldSubmitListener), newSubmitListener);
  console.log('✅ Đã cập nhật submit eventForm listener.');
}

fs.writeFileSync('admin/js/admin.js', normAdmin.replace(/\n/g, adminJs.includes('\r\n') ? '\r\n' : '\n'), 'utf8');
console.log('✅ admin/js/admin.js hoàn tất.');

console.log('--- 2. Nâng cấp js/app.js (Tự động ẩn sự kiện hết hạn / ẩn thủ công) ---');
let appJs = fs.readFileSync('js/app.js', 'utf8');
let normApp = norm(appJs);

const oldLoadLiveEvents = `// ==================== LOAD LIVE EVENTS FROM D1 / LOCAL ====================
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
}`;

const newLoadLiveEvents = `// ==================== LOAD LIVE EVENTS FROM D1 / LOCAL ====================
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
    const today = new Date().toISOString().split('T')[0];

    // Lọc sự kiện:
    // 1. Loại bỏ các sự kiện bị Admin ẩn thủ công (status === 'hidden')
    // 2. Nếu có ngày kết thúc (end_date) và hôm nay đã vượt quá ngày kết thúc -> Tự động ẩn!
    // 3. Nếu KHÔNG nhập ngày kết thúc (end_date để trống) -> LUÔN HIỂN THỊ!
    const visibleEvents = events.filter(ev => {
      if (ev.status === 'hidden') return false;
      if (ev.end_date && ev.end_date.trim() !== '') {
        if (today > ev.end_date.trim()) return false;
      }
      return true;
    });

    // Populate eventData object for modal
    visibleEvents.forEach(ev => {
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
    if (visibleEvents.length > 0) {
      eventsGrid.innerHTML = visibleEvents.map(ev => {
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
}`;

if (normApp.includes(norm(oldLoadLiveEvents))) {
  normApp = normApp.replace(norm(oldLoadLiveEvents), newLoadLiveEvents);
  console.log('✅ Đã cập nhật logic tự động ẩn sự kiện trong js/app.js.');
}

fs.writeFileSync('js/app.js', normApp.replace(/\n/g, appJs.includes('\r\n') ? '\r\n' : '\n'), 'utf8');
console.log('✅ js/app.js hoàn tất.');
