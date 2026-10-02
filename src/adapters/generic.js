// Universal Fallback Adapter for Any Manga Website
// Detects common manga reader buttons, pagination, and generic ads

window.MangaAdapters = window.MangaAdapters || {};

window.MangaAdapters['generic'] = {
  name: 'Universal Manga Reader',

  match: function () {
    return true; // Fallback
  },

  isReader: function () {
    const path = window.location.pathname.toLowerCase();
    return path.includes('chapter') || path.includes('doc-truyen') || path.includes('read') || path.includes('chuong');
  },

  adSelectors: [
    'iframe[src*="ad"]',
    'iframe[src*="banner"]',
    'div[class*="ad-container"]',
    'div[id*="ad-slot"]',
    'div[class*="sponsor"]'
  ],

  nextChapterSelectors: [
    'a.next',
    'a.btn-next',
    'a[rel="next"]',
    'button.next',
    '[aria-label*="Next" i]',
    '[title*="Next" i]'
  ],

  purgeAds: function () {
    for (const sel of this.adSelectors) {
      document.querySelectorAll(sel).forEach(el => el.remove());
    }
  }
};
