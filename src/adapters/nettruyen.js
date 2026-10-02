// Adapter: NetTruyen & NhatTruyen (nettruyen*.*, nhattruyen*.*)

window.MangaAdapters = window.MangaAdapters || {};

window.MangaAdapters['nettruyen'] = {
  name: 'NetTruyen',

  match: function () {
    const host = window.location.hostname.toLowerCase();
    return host.includes('nettruyen') || host.includes('nhattruyen');
  },

  isReader: function () {
    const path = window.location.pathname.toLowerCase();
    return path.includes('chap-') || path.includes('/chuong-') || path.includes('chapter');
  },

  adSelectors: [
    'iframe[src*="ad"]',
    'iframe[src*="banner"]',
    '.bottom-ads',
    '#floating-ad',
    '.middle-ads',
    '.ads-holder',
    '.banner-holder',
    'div[id^="ads"]',
    'div[id*="ad_"]',
    'div[class*="ads-"]',
    'div[class*="banner-"]',
    'div[style*="position: fixed"][style*="bottom: 0"]',
    '#reader-notice',
    '.reader-notice',
    '.modal-adblock'
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
      try {
        document.querySelectorAll(sel).forEach(el => el.remove());
      } catch (e) {}
    }

    if (document.body && document.body.classList.contains('reader-locked')) {
      document.body.classList.remove('reader-locked');
      document.body.style.overflow = 'auto';
    }
  }
};
