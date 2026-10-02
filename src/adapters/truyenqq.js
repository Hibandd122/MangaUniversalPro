// Adapter: TruyenQQ (truyenqq*.com, truyenqq*.vn, truyenqqko.com, truyenqqq.org, etc.)

window.MangaAdapters = window.MangaAdapters || {};

window.MangaAdapters['truyenqq'] = {
  name: 'TruyenQQ',

  match: function () {
    const host = window.location.hostname.toLowerCase();
    return host.includes('truyenqq') || host.includes('tvtruyen');
  },

  isReader: function () {
    const path = window.location.pathname.toLowerCase();
    return path.includes('chapter-') || path.includes('/chap-') || path.includes('chap');
  },

  adSelectors: [
    // 1. Popup quảng cáo toàn màn hình & Popunder
    '#image_popup',
    '#image_popup_mobile',
    '.image_popup',
    'div[id^="preload_ads"]',
    'div[id^="preload_banner"]',

    // 2. Banner trượt & Banner cố định 2 bên viền (Desktop & Mobile)
    '#ads_mobile',
    '.ads_close_mobile',
    '#left-banner',
    '#right-banner',
    '#top-banner',
    '#bottom_banner',
    '#bottom-banner',
    '.ads_close',
    '#floating-ad',
    '.ad_fixed',
    '.ad-container',
    '.box_ads',
    '.box-ads',
    '.banner-desktop',
    '.banner-mobile',
    '.ads-holder',
    '.banner-holder',
    '.bottom-ads',
    '.middle-ads',

    // 3. Khối Shopee / Lazada Affiliate chèn giữa các trang truyện
    '.productafs',
    '.product-grid',
    '.product-item',
    'div:has(> .product-grid)',
    'div:has(> .productafs)',
    'a[href*="shopee.vn"]',
    'a[href*="s.shopee.vn"]',
    'a[href*="lazada.vn"]',
    'a[href*="s.lazada.vn"]',

    // 4. Iframes & Ad Networks bên thứ 3
    'iframe[src*="traffictop"]',
    'iframe[src*="bundleunum"]',
    'iframe[src*="googletagmanager"]',
    'iframe[src*="ad"]',
    'iframe[src*="banner"]',

    // 5. Bẫy thông báo chống AdBlock của TruyenQQ
    '#reader-notice',
    '.reader-notice',
    'div[class*="reader-notice"]',

    // 6. Link & Banner Nhà Cái / Cờ Bạc / Casino / Cá Độ
    'a[href*="fun88"]',
    'a[href*="mm88"]',
    'a[href*="mb66"]',
    'a[href*="xx88"]',
    'a[href*="ww88"]',
    'a[href*="kubet"]',
    'a[href*="o8v"]',
    'a[href*="o8bet"]',
    'a[href*="boc88"]',
    'a[href*="sv368"]',
    'a[href*="sv388"]',
    'a[href*="go88"]',
    'a[href*="xoilac"]',
    'a[href*="kqbd"]',
    'a[href*="win79"]',
    'a[href*="sunwin"]',
    'a[href*="rikvip"]',
    'a[href*="b52"]',
    'a[href*="789club"]',
    'a[href*="f8bet"]',
    'a[href*="shbet"]',
    'a[href*="new88"]',
    'a[href*="hi88"]',
    'a[href*="jun88"]',
    'a[href*="78win"]',
    'a[href*="okvip"]',

    // 7. Generic id bẫy quảng cáo
    'div[id*="ad_"]',
    'div[id*="ads_"]',
    'div[id^="ads"]',
    'div[style*="z-index: 2147483647"]',
    'div[style*="z-index: 999999"]'
  ],

  nextChapterSelectors: [
    'a.next',
    'a.btn_next',
    'a.next_chapter',
    'a[href*="chapter-"]:has(i.fa-chevron-right)',
    'a[href*="chapter-"]:has(i.fa-arrow-right)',
    'a.btn-action.next'
  ],

  purgeAds: function () {
    // 1. Quét và loại bỏ tất cả node quảng cáo định danh
    for (const sel of this.adSelectors) {
      try {
        document.querySelectorAll(sel).forEach(el => el.remove());
      } catch (e) {}
    }

    // 2. Mở khóa đọc nếu bị dính class reader-locked
    if (document.body.classList.contains('reader-locked')) {
      document.body.classList.remove('reader-locked');
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.body.style.height = 'auto';
    }

    // 3. Quét các thẻ <a> dẫn sang web cờ bạc, shopee, bên thứ ba gắn hình banner
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    for (const a of externalLinks) {
      const href = a.href.toLowerCase();
      if (!href.includes('truyenqq') && !href.includes('discord.com') && !href.includes('facebook.com')) {
        const hasAdKeywords = ['bet', '88', 'casino', 'shopee', 'lazada', 'game', 'aff', 'traffictop', 'link', 'banner'].some(k => href.includes(k));
        const hasImg = a.querySelector('img') !== null;
        if (hasAdKeywords || hasImg) {
          const wrapper = a.closest('.product-item, .productafs, .product-grid, div');
          if (wrapper && wrapper !== document.body && wrapper.children.length === 1) {
            wrapper.remove();
          } else {
            a.remove();
          }
        }
      }
    }

    // 4. Xóa banner cố định bám 2 bên màn hình (nếu có inline style)
    const fixedElements = document.querySelectorAll('div[style*="fixed"]');
    for (const el of fixedElements) {
      const style = el.getAttribute('style') || '';
      if ((style.includes('left:') || style.includes('right:')) && !el.id.includes('uptop') && !el.classList.contains('chapter_scroll')) {
        el.remove();
      }
    }
  }
};

