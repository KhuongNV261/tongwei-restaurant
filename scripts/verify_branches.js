const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');
const adminHtml = fs.readFileSync('admin/index.html', 'utf8');
const adminJs = fs.readFileSync('admin/js/admin.js', 'utf8');

let pass = 0;
let fail = 0;
function assert(desc, condition) {
  if (condition) {
    console.log('✅ PASS: ' + desc);
    pass++;
  } else {
    console.error('❌ FAIL: ' + desc);
    fail++;
  }
}

console.log('=== VERIFYING FRONTEND ===');
assert('index.html contains #dat-ban section', indexHtml.includes('id="dat-ban"'));
assert('index.html DOES NOT contain bookingForm', !indexHtml.includes('id="bookingForm"'));
assert('index.html DOES NOT contain Hoac De Lai Thong Tin', !indexHtml.includes('Hoặc Để Lại Thông Tin'));
assert('index.html DOES NOT contain Gui Yeu Cau Goi Lai', !indexHtml.includes('Gửi Yêu Cầu Gọi Lại'));
assert('index.html has 1-touch hotline hub title', indexHtml.includes('Trung Tâm Bấm Số Gọi Đặt Bàn Trực Tiếp (1 Chạm)'));
assert('index.html has Branch 1 (Hoan Kiem) with 039 736 0228', indexHtml.includes('039 736 0228') && indexHtml.includes('Trần Hưng Đạo'));
assert('index.html has Branch 2 (Nguyen Thi Thap) with 032 889 5693', indexHtml.includes('032 889 5693') && indexHtml.includes('Nguyễn Thị Thập'));
assert('index.html has Branch 3 (Duy Tan) with 0988 567 890', indexHtml.includes('0988 567 890') && indexHtml.includes('Duy Tân'));
assert('index.html has tel: links for 1-tap call', indexHtml.includes('href="tel:0397360228"') && indexHtml.includes('href="tel:0328895693"') && indexHtml.includes('href="tel:0988567890"'));
assert('index.html has Google Maps links', indexHtml.includes('maps.google.com') || indexHtml.includes('google.com/maps'));

assert('app.js DOES NOT have bookingForm.addEventListener', !appJs.includes('elements.bookingForm.addEventListener'));
assert('app.js renderBranches sorts by STT', appJs.includes('branches.sort((a, b) => Number(a.stt || 0) - Number(b.stt || 0))'));
assert('app.js has defaultBranches with 3 branches', appJs.includes('039 736 0228') && appJs.includes('032 889 5693') && appJs.includes('0988 567 890'));

console.log('\n=== VERIFYING ADMIN ===');
assert('admin/index.html DOES NOT have bookings sidebar tab', !adminHtml.includes('data-tab="bookings"'));
assert('admin/index.html DOES NOT have pane-bookings section', !adminHtml.includes('id="pane-bookings"'));
assert('admin/index.html has kpiBranchesCount on dashboard', adminHtml.includes('id="kpiBranchesCount"'));
assert('admin/index.html has dashboardBranchesTbody', adminHtml.includes('id="dashboardBranchesTbody"'));
assert('admin/index.html branchesTable has STT, Hotline, Quy mo columns', adminHtml.includes('id="branchesTable"') && adminHtml.includes('Quy mô') && adminHtml.includes('Hotline đặt bàn'));
assert('admin/index.html branchModal has modalBranchStt', adminHtml.includes('id="modalBranchStt"'));
assert('admin/index.html branchModal has modalBranchPhone', adminHtml.includes('id="modalBranchPhone"'));

assert('admin/js/admin.js defaultBranches has STT 1, 2, 3', adminJs.includes('stt: 1') && adminJs.includes('stt: 2') && adminJs.includes('stt: 3'));
assert('admin/js/admin.js renderBranchesView sorts by STT', adminJs.includes('adminState.branches.sort((a, b) => Number(a.stt || 0) - Number(b.stt || 0))'));
assert('admin/js/admin.js openBranchModal populates modalBranchStt', adminJs.includes('modalBranchStt'));
assert('admin/js/admin.js exports addBranchModal and editBranchModal', adminJs.includes('window.addBranchModal') && adminJs.includes('window.editBranchModal'));

console.log('\n================================');
console.log(`TOTAL: ${pass} PASSED, ${fail} FAILED`);
console.log('================================');
if (fail > 0) process.exit(1);
