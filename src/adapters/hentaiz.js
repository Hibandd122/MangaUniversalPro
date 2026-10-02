// Adapter: HentaiZ (hentaiz.foo, hentaiz.net, hentaiz.cc, hentaiz.vip, hentaiz.*)
// Deep integration: Ad neutralization, Popunder killer, Absolute Video Player Protection

window.MangaAdapters = window.MangaAdapters || {};

window.MangaAdapters['hentaiz'] = {
  name: 'HentaiZ',

  match: function () {
    const host = window.location.hostname.toLowerCase();
    return host.includes('hentaiz.') || host.startsWith('hentaiz');
  },

  isReader: function () {
    const path = window.location.pathname.toLowerCase();
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
    'div[style*="z-index: 999999"]:not(#md-autonext-widget)'
  ],

  nextChapterSelectors: [
    'a[href*="/watch/"]'
  ],

  // Thanh trừng triệt để banner & popup nhưng BẢO VỆ TUYỆT ĐỐI trình phát video player (haiten.org)
  purgeAds: function () {
    // 1. Xóa các container quảng cáo và script bẫy cụ thể của HentaiZ
    const adNodes = document.querySelectorAll(this.adSelectors.join(','));
    for (const el of adNodes) {
      if (el.closest('[class*="aspect-video"], .video-container, #player')) {
        continue;
      }
      el.remove();
    }

    // 2. Chỉ xóa các iframe quảng cáo đã được xác định chắc chắn
    const adIframes = document.querySelectorAll('iframe[id*="__clb-spot"], iframe[src*="janitorprecisiontrio"], iframe[src*="frozenpayerpregnant"], iframe[src*="clammyendearedkeg"]');
    for (const ifr of adIframes) {
      ifr.remove();
    }
  }
};

