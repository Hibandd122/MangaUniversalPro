// Adapter: NetTruyen (nettruyen*.com, nettruyen*.vn)

window.MangaAdapters = window.MangaAdapters || {};

window.MangaAdapters['nettruyen'] = {
  name: 'NetTruyen',

  match: function () {
    return window.location.hostname.includes('nettruyen');
  },

  isReader: function () {
    const path = window.location.pathname.toLowerCase();
    return path.includes('chap-') || path.includes('/chuong-');
  },

  adSelectors: [
    'iframe[src*="ad"]',
    'iframe[src*="banner"]',
    '.bottom-ads',
    '#floating-ad',
    '.middle-ads',
    'div[id^="ads"]',
    'div[id*="ad_"]',
    'div[class*="ads-"]',
    'div[class*="banner-"]',
    'div[style*="position: fixed"][style*="bottom: 0"]'
  ],

  nextChapterSelectors: [
    'a.next',
    'a.navNext',
    'a.chapter-nav-btn.next',
    'a:has(.fa-chevron-right)',
    'a:has(.fa-arrow-right)',
    '.btn-navigation-next'
  ],

  purgeAds: function () {
    for (const sel of this.adSelectors) {
      document.querySelectorAll(sel).forEach(el => el.remove());
    }
  }
};
