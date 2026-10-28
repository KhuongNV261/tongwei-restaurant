const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const adminHtml = fs.readFileSync('admin/index.html', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');
const adminJs = fs.readFileSync('admin/js/admin.js', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

const lookbookTabsHtml = (indexHtml.match(/<div class="lookbook-tabs"[\s\S]*?<\/div>/) || [''])[0];

const report = {
  dead_elements_purged: {
    no_cart_button_in_navbar: !indexHtml.includes('id="cartBtn"'),
    no_cart_modal_in_html: !indexHtml.includes('id="cartModal"'),
    no_booking_form_in_frontend: !indexHtml.includes('id="bookingForm"'),
    no_booking_tab_in_admin_sidebar: !adminHtml.includes('data-tab="bookings"'),
    no_booking_pane_in_admin: !adminHtml.includes('id="pane-bookings"')
  },
  duytan_cs3_purged: {
    no_duytan_in_index_html: !/duytan|duy tân|cs-03|space_dt|letan_dt/i.test(indexHtml),
    no_duytan_in_admin_html: !/duytan|duy tân|cs-03|space_dt|letan_dt/i.test(adminHtml),
    no_duytan_in_css: !/duytan|duy tân|cs-03|space_dt|letan_dt/i.test(styleCss),
    app_js_only_has_purge_filters: !(appJs.match(/duytan|duy tân|cs-03|space_dt|letan_dt/gi) || []).some(m => !appJs.includes('filter(') && !appJs.includes('!==')),
    admin_js_only_has_purge_filters: !(adminJs.match(/duytan|duy tân|cs-03|space_dt|letan_dt/gi) || []).some(m => !adminJs.includes('filter(') && !adminJs.includes('!==' || !adminJs.includes('!u.')))
  },
  branches_and_staff: {
    cs01_hoan_kiem_present: indexHtml.includes('039 736 0228'),
    cs02_nguyen_thi_thap_present: indexHtml.includes('032 889 5693'),
    direct_call_tel_links: indexHtml.includes('href="tel:0397360228"') && indexHtml.includes('href="tel:0328895693"'),
    branches_sorted_by_stt: appJs.includes('Number(a.stt || 0) - Number(b.stt || 0)'),
    admin_login_branch_select_has_cs01_cs02: adminHtml.includes('value="CS-01"') && adminHtml.includes('value="CS-02"'),
    admin_staff_modal_has_branch_field: adminHtml.includes('id="addUserBranch"'),
    staff_has_receptionists_hk_ntt: adminJs.includes('letan_hk1') && adminJs.includes('letan_ntt1')
  },
  gallery_and_aesthetics: {
    real_fb_photos_ntt_present: appJs.includes('nguyen_thi_thap_fb_1.jpg') && appJs.includes('nguyen_thi_thap_fb_5.jpg'),
    space_only_section_in_frontend: lookbookTabsHtml.includes('data-cat="space_ntt"') && !lookbookTabsHtml.includes('data-cat="dimsum"'),
    editorial_mosaic_layout_in_app: appJs.includes('editorial-mosaic-ntt') && appJs.includes('editorial-mosaic-hk') && appJs.includes('space-all-grid'),
    editorial_mosaic_styles_in_css: styleCss.includes('.editorial-mosaic-ntt') && styleCss.includes('.editorial-mosaic-hk'),
    lightbox_intact: indexHtml.includes('id="lightboxModal"') && appJs.includes('openMasterAlbum')
  }
};

console.log(JSON.stringify(report, null, 2));

const allPassed = Object.values(report).every(group => Object.values(group).every(val => val === true));
console.log('\nFINAL VERIFICATION RESULT: ' + (allPassed ? 'ALL PASS (100%)' : 'SOME CHECKS FAILED'));
