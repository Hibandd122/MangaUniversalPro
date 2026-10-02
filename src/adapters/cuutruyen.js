// Adapter: CuuTruyen (cuutruyen.net)

window.MangaAdapters = window.MangaAdapters || {};

window.MangaAdapters['cuutruyen.net'] = {
  name: 'Cửu Truyện (CuuTruyen)',

  match: function () {
    return window.location.hostname.includes('cuutruyen.net');
  },

  isReader: function () {
    return window.location.pathname.includes('/chapters/');
  },

  adSelectors: [
    'iframe[src*="ad"]',
    'iframe[src*="banner"]',
    'div[class*="sponsor"]',
    'div[class*="banner"]',
    'a[href*="affiliate"]',
    'div[id*="ad-slot"]'
  ],

  nextChapterSelectors: [
    'a[href*="/chapters/"]:has(svg)',
    'button:has(svg.feather-chevron-right)',
    'a[aria-label*="kế tiếp" i]',
    'a[aria-label*="next" i]',
    'a[title*="kế tiếp" i]',
    'a[title*="next" i]',
    'a.next'
  ],

  purgeAds: function () {
    for (const sel of this.adSelectors) {
      document.querySelectorAll(sel).forEach(el => el.remove());
    }
  }
};
