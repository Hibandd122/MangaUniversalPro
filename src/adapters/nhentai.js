// Adapter: nHentai (nhentai.net, nhentai.xxx, nhentai.to)
// Deep integration: Ad neutralization, Popunder trap defang, Clean navigation

window.MangaAdapters = window.MangaAdapters || {};

window.MangaAdapters['nhentai.net'] = {
  name: 'nHentai',

  match: function () {
    const host = window.location.hostname.toLowerCase();
    return host.includes('nhentai.net') || host.includes('nhentai.xxx') || host.includes('nhentai.to');
  },

  isReader: function () {
    // /g/{id}/{page}/ or /g/{id}/
    return /^\/g\/\d+\/\d+\/?$/.test(window.location.pathname);
  },

  adSelectors: [
    // 1. Mạng quảng cáo người lớn phổ biến trên nHentai
    'iframe[src*="exoclick"]',
    'iframe[src*="juicyads"]',
    'iframe[src*="ero-advertising"]',
    'iframe[src*="trafficjunky"]',
    'iframe[src*="tsyndicate"]',
    'iframe[src*="chaturbate"]',
    
    // 2. Banner & Popunder container
    '#ad-banner',
    '.ad-banner',
    '.advertisement',
    '#chaturbate-ad',
    '.banner-holder',
    '.script_manager_video_master',
    'div[id*="ad_"]',
    'div[class*="ad-"]',
    'div[data-jads-slot]',
    
    // 3. Link quảng cáo ngoài & Bẫy click chuyển hướng
    'a[href*="/api/_/popunder"]',
    'a[href*="chaturbate.com"]',
    'a[href*="exoclick.com"]',
    'a[href*="theporndude.com"]',
    'a[href*="daftsex.eu"]',
    'a[href*="animemafia.to"]',
    'a[href*="juicyads.com"]',
    'a[href*="ero-advertising.com"]'
  ],

  nextChapterSelectors: [
    '#image-container a',
    'a.next',
    'button.next',
    '.pagination a.next'
  ],

  // Thanh trừng quảng cáo & Hóa giải bẫy click chuột
  purgeAds: function () {
    // 1. Xóa các container quảng cáo
    for (const sel of this.adSelectors) {
      try {
        document.querySelectorAll(sel).forEach(el => el.remove());
      } catch (e) {}
    }

    // 2. Hóa giải bẫy popunder gài trên ảnh đọc truyện (#image-container)
    const imgLink = document.querySelector('#image-container a');
    if (imgLink && !imgLink.dataset.defanged) {
      imgLink.dataset.defanged = 'true';
      // Ngăn chặn các script bên ngoài gài popup khi bấm vào ảnh
      imgLink.addEventListener('click', function (e) {
        e.stopPropagation();
      }, true);
    }
  }
};

