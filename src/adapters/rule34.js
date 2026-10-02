// Adapter: Rule34 Universal (rule34.xxx & rule34video.com)
// Full ad neutralization, popunder defang, video player acceleration, image preloading

window.MangaAdapters = window.MangaAdapters || {};

window.MangaAdapters['rule34'] = {
  name: 'Rule34 Universal',

  match: function () {
    const host = window.location.hostname.toLowerCase();
    return host.includes('rule34.xxx') || host.includes('rule34video.com');
  },

  isReader: function () {
    const host = window.location.hostname.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    
    // 1. rule34video.com: /video/{id}/{slug}/
    if (host.includes('rule34video.com')) {
      return path.startsWith('/video/');
    }
    
    // 2. rule34.xxx: index.php?page=post&s=view
    try {
      const sp = new URLSearchParams(window.location.search);
      return sp.get('page') === 'post' && sp.get('s') === 'view';
    } catch (e) {
      return false;
    }
  },

  adSelectors: [
    // Container Clickadilla / ExoClick
    'iframe[id*="__clb-spot"]',
    'div[id*="__clb-spot"]',
    'div[class*="spot_"]',
    
    // Mạng quảng cáo rule34video.com
    'iframe[src*="trialhd.com"]',
    'iframe[src*="sadbaguette.com"]',
    'iframe[src*="jads.co"]',
    'iframe[src*="chilihandshakewing"]',
    '.sidebar_ad_buttons',
    '.panel_header--promo',
    'a[href*="trafficjunky"]',
    'a[href*="jads.co"]',
    
    // Mạng quảng cáo rule34.xxx
    '#ad-top',
    '#ad-bottom',
    '#ad-left',
    '#ad-right',
    '.ad-banner',
    'div[id*="ad_"]',
    'iframe[src*="exoclick"]',
    'iframe[src*="juicyads"]',
    'iframe[src*="trafficjunky"]',
    'iframe[src*="ero-advertising"]',
    
    // Popunder / floating overlays
    'div[style*="z-index: 2147483647"]',
    'div[style*="z-index: 999999"]:not(#md-autonext-widget)'
  ],

  nextChapterSelectors: [
    // rule34video: Related video link
    '#custom_list_videos_related_videos a[href*="/video/"]',
    // rule34.xxx: Next post in pool or tag list
    'a[alt="next"]',
    'a[title="Next Post"]'
  ],

  // Thanh trừng toàn bộ quảng cáo nhưng BẢO VỆ TUYỆT ĐỐI khung phát video (#kt_player) và ảnh chính (#image)
  purgeAds: function () {
    // 1. Xóa các container quảng cáo theo selector
    const nodes = document.querySelectorAll(this.adSelectors.join(','));
    for (const el of nodes) {
      if (el.closest('#kt_player, .kt-player, #image, #gelcomVideoPlayer')) {
        continue;
      }
      el.remove();
    }

    // 2. Xóa các iframe quảng cáo độc hại
    const iframes = document.querySelectorAll('iframe');
    for (const ifr of iframes) {
      const src = (ifr.getAttribute('src') || '').toLowerCase();
      // Bỏ qua nếu là player hợp lệ
      if (ifr.closest('#kt_player, .kt-player') || ifr.hasAttribute('allowfullscreen')) {
        continue;
      }
      if (
        src.includes('trialhd') ||
        src.includes('sadbaguette') ||
        src.includes('jads.co') ||
        src.includes('chilihandshakewing') ||
        src.includes('exoclick') ||
        src.includes('juicyads') ||
        src.includes('trafficjunky') ||
        ifr.id.includes('__clb-spot')
      ) {
        ifr.remove();
      }
    }
  }
};

