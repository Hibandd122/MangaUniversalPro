// Adapter: HentaiZ (hentaiz.foo, hentaiz.net, hentaiz.cc, hentaiz.vip, hentaiz.*)
// Deep integration: Ad neutralization, Popunder killer, Episode/Gallery navigation, Reading History

window.MangaAdapters = window.MangaAdapters || {};

window.MangaAdapters['hentaiz'] = {
  name: 'HentaiZ',

  match: function () {
    const host = window.location.hostname.toLowerCase();
    return host.includes('hentaiz.') || host.startsWith('hentaiz');
  },

  isReader: function () {
    const path = window.location.pathname.toLowerCase();
    // /watch/:slug hoặc /gallery/:slug
    return path.startsWith('/watch/') || path.startsWith('/gallery/');
  },

  adSelectors: [
    'iframe[id*="__clb-spot"]',
    'div[id*="__clb-spot"]',
    'div[class*="spot_"]',
    'iframe[src*="janitorprecisiontrio"]',
    'iframe[src*="frozenpayerpregnant"]',
    'iframe[src*="clammyendearedkeg"]',
    'script[src*="janitorprecisiontrio"]',
    'script[src*="frozenpayerpregnant"]',
    'script[src*="clammyendearedkeg"]',
    'a[href*="meoden.net"]',
    'div[style*="z-index: 2147483647"]',
    'div[style*="z-index: 999999"]:not(#md-turbo-widget)'
  ],

  nextChapterSelectors: [
    // Next episode link in watch list
    'a[href*="/watch/"]'
  ],

  getTitle: function () {
    const h1 = document.querySelector('h1');
    if (h1 && h1.textContent.trim()) {
      return h1.textContent.replace(/\|.*$/g, '').trim();
    }
    return document.title.replace(/\|.*HentaiZ.*$/gi, '').trim();
  },

  getChapter: function () {
    const path = window.location.pathname;
    if (path.includes('/watch/')) {
      const match = path.match(/-(\d+)$/);
      if (match) {
        return `Tập ${match[1]}`;
      }
      return 'Xem Tập';
    }
    if (path.includes('/gallery/')) {
      return 'Bộ Sưu Tập';
    }
    return 'Nội Dung';
  },

  // Thanh trừng triệt để banner & popup nhưng BẢO VỆ TUYỆT ĐỐI trình phát video player (haiten.org)
  purgeAds: function () {
    // 1. Xóa các container quảng cáo và script bẫy cụ thể của HentaiZ
    const adNodes = document.querySelectorAll(this.adSelectors.join(','));
    for (const el of adNodes) {
      // Đảm bảo không xóa nhầm container của video player
      if (el.closest('[class*="aspect-video"], .video-container, #player')) {
        continue;
      }
      el.remove();
    }

    // 2. Chỉ xóa các iframe quảng cáo đã được xác định chắc chắn (mang id __clb-spot hoặc domain quảng cáo)
    const adIframes = document.querySelectorAll('iframe[id*="__clb-spot"], iframe[src*="janitorprecisiontrio"], iframe[src*="frozenpayerpregnant"], iframe[src*="clammyendearedkeg"]');
    for (const ifr of adIframes) {
      ifr.remove();
    }
  }
};
