// Adapter: nhentai (nhentai.net, nhentai.xxx, nhentai.to)
// Deep integration: Ad neutralization, Next-page 0s Preload, Broken image CDN recovery, Hotkeys

window.MangaAdapters = window.MangaAdapters || {};

window.MangaAdapters['nhentai.net'] = {
  name: 'nHentai',

  match: function () {
    const host = window.location.hostname;
    return host.includes('nhentai.net') || host.includes('nhentai.xxx') || host.includes('nhentai.to');
  },

  isReader: function () {
    // /g/{id}/{page}/ or /g/{id}/
    return /^\/g\/\d+\/\d+\/?$/.test(window.location.pathname);
  },

  adSelectors: [
    'iframe[src*="exoclick"]',
    'iframe[src*="juicyads"]',
    'iframe[src*="ero-advertising"]',
    'iframe[src*="trafficjunky"]',
    'iframe[src*="tsyndicate"]',
    'iframe[src*="chaturbate"]',
    '#ad-banner',
    '.ad-banner',
    '.advertisement',
    '#chaturbate-ad',
    '.banner-holder',
    'div[id*="ad_"]',
    'div[class*="ad-"]'
  ],

  nextChapterSelectors: [
    '#image-container a',
    'a.next',
    'button.next',
    '.pagination a.next'
  ],

  // Thông tin truyện để lưu lịch sử
  getTitle: function () {
    const titleEl = document.querySelector('#info h1.title, #info h2.title, h1.title');
    if (titleEl) {
      return titleEl.textContent.trim();
    }
    // Lấy từ document.title
    return document.title.replace(/»\s*nhentai.*$/i, '').trim();
  },

  getChapter: function () {
    const match = window.location.pathname.match(/\/g\/(\d+)\/(\d+)\/?/);
    if (match) {
      const page = match[2];
      const totalPagesEl = document.querySelector('.num-pages, span.num-pages');
      const total = totalPagesEl ? totalPagesEl.textContent.trim() : '';
      return total ? `Trang ${page} / ${total}` : `Trang ${page}`;
    }
    return 'Chi tiết';
  },

  // Dọn sạch quảng cáo & khung thừa
  purgeAds: function () {
    for (const sel of this.adSelectors) {
      const items = document.querySelectorAll(sel);
      for (const el of items) {
        el.remove();
      }
    }
  },

  // Khôi phục ảnh lỗi bằng CDN dự phòng
  recoverBrokenImage: function (img) {
    if (!img || !img.src) return;
    const url = new URL(img.src);
    // Danh sách CDN thay thế của nhentai: i.nhentai.net, i2.nhentai.net, i3.nhentai.net, i5.nhentai.net, i7.nhentai.net
    const cdns = ['i.nhentai.net', 'i3.nhentai.net', 'i5.nhentai.net', 'i7.nhentai.net'];
    const currentHost = url.hostname;
    const availableCdns = cdns.filter(c => c !== currentHost);
    
    if (availableCdns.length > 0) {
      const nextCdn = availableCdns[Math.floor(Math.random() * availableCdns.length)];
      url.hostname = nextCdn;
      url.searchParams.set('_retry', Date.now());
      img.src = url.toString();
    }
  }
};
