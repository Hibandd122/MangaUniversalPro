// Adapter: MangaDex (mangadex.org)
// Specific ad targets, Vue router hooks, and chapter reader selectors

window.MangaAdapters = window.MangaAdapters || {};

window.MangaAdapters['mangadex.org'] = {
  name: 'MangaDex',
  
  match: function () {
    return window.location.hostname.includes('mangadex.org');
  },

  isReader: function () {
    return window.location.pathname.startsWith('/chapter/');
  },

  adSelectors: [
    'iframe[src*="e-embed.mangadex.org"]',
    'iframe[src*="ads.html"]',
    'video[src*="/temp/"]',
    'img[src*="/temp/"]',
    'a[href*="/advertise"]',
    'a[href*="anime-gifs.com"]',
    'a[href*="amazon.com?utm_source=md"]',
    'a[href="/support-us"]'
  ],

  nextChapterSelectors: [
    '[aria-label*="Next chapter" i]',
    '[title*="Next chapter" i]',
    '[aria-label*="Next page" i]',
    '[title*="Next page" i]',
    'button:has(svg.feather-chevron-right)',
    'button:has(svg.tabler-icon-chevron-right)',
    'a[href*="/chapter/"]:has(svg)'
  ],

  // Specific purge logic
  purgeAds: function () {
    for (const sel of this.adSelectors) {
      const items = document.querySelectorAll(sel);
      for (const el of items) {
        const parent = el.closest('div.flex, div.grid, div.relative');
        if (parent && parent.children.length === 1 && parent !== document.body) {
          parent.remove();
        } else {
          el.remove();
        }
      }
    }
  }
};
