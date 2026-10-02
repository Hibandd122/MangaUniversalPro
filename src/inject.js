// Universal Runtime JS Injected Hook (Runs in page context: MAIN world)
// Defeats Anti-AdBlock Traps, Intercepts Bait Scripts, Prevents Image Hijacking & Blocks Rogue Ads

(function () {
  'use strict';

  // =========================================================================
  // 1. Vô hiệu hóa bẫy Anti-AdBlock (Bait Scripts: adsbygoogle, prebid, etc.)
  // =========================================================================
  // Tạo giả đối tượng adsbygoogle để qua mặt các đoạn code kiểm tra
  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.push = function () { return true; };
  window.adsbygoogle.loaded = true;

  // Intercept document.createElement('script')
  // Khi trang cố tình nạp script quảng cáo mồi (như TruyenQQ chapter2.js line 1) để check xem có bị chặn mạng không:
  // Ta giả lập tải thành công (onload) để script của trang tưởng quảng cáo đã chạy bình thường!
  const origCreateElement = document.createElement;
  document.createElement = function (tagName, options) {
    const el = origCreateElement.call(document, tagName, options);
    if (typeof tagName === 'string' && tagName.toLowerCase() === 'script') {
      const origSetAttribute = el.setAttribute;
      const checkBait = (src) => {
        if (typeof src === 'string' && (
          src.includes('pagead2.googlesyndication.com') ||
          src.includes('adsbygoogle') ||
          src.includes('prebid') ||
          src.includes('googletagservices')
        )) {
          setTimeout(() => {
            if (typeof el.onload === 'function') {
              try { el.onload(); } catch (e) {}
            }
            try {
              el.dispatchEvent(new Event('load'));
            } catch (e) {}
          }, 15);
        }
      };

      el.setAttribute = function (name, value) {
        if (name && name.toLowerCase() === 'src') checkBait(value);
        return origSetAttribute.apply(this, arguments);
      };

      let _src = '';
      try {
        Object.defineProperty(el, 'src', {
          get() { return _src; },
          set(val) {
            _src = val;
            checkBait(val);
          },
          configurable: true
        });
      } catch (e) {}
    }
    return el;
  };

  // =========================================================================
  // 2. Chống bẫy popup / popunder mở tab ngầm (TruyenQQ, NetTruyen, nHentai)
  // =========================================================================
  const origOpen = window.open;
  window.open = function (url, target, features) {
    if (typeof url === 'string') {
      const suspicious = [
        'bundleunum', 'adservice', 'doubleclick', 'onclick', 'popunder',
        'affiliate', 'game', 'bet', 'casino', 'redirect', 'click', 'syndication',
        'popcash', 'exoclick', 'juicyads', 'trafficjunky'
      ];
      if (suspicious.some(term => url.toLowerCase().includes(term))) {
        console.info('[Manga Pro] Blocked popup window.open:', url);
        return null;
      }
    }
    return origOpen.apply(this, arguments);
  };

  // =========================================================================
  // 3. Vô hiệu hóa Google Tag Manager / Analytics / Trackers
  // =========================================================================
  window.dataLayer = [];
  window.gtag = function () {};

  // =========================================================================
  // 4. MangaDex: Chặn fallback quảng cáo tự kích hoạt qua postMessage
  // =========================================================================
  const origAddEventListener = window.addEventListener;
  window.addEventListener = function (type, listener, options) {
    if (type === 'message' && typeof listener === 'function') {
      const wrappedListener = function (event) {
        if (typeof event.data === 'string' && (
          event.data.startsWith('ads-loaded') ||
          event.data.startsWith('fallback-loaded') ||
          event.data.startsWith('render-ad-fallback:')
        )) {
          return;
        }
        return listener.apply(this, arguments);
      };
      return origAddEventListener.call(this, type, wrappedListener, options);
    }
    return origAddEventListener.call(this, type, listener, options);
  };

  // =========================================================================
  // 5. Chặn TruyenQQ tự động biến ảnh lỗi thành placeholder xám
  // =========================================================================
  // TruyenQQ script #12 đăng ký: img.src = '/images/image-placeholder.webp'
  // Ta chặn trước ở capture phase, bảo toàn URL gốc để Engine tự khôi phục
  origAddEventListener.call(window, 'error', function (e) {
    if (e.target && e.target.tagName === 'IMG') {
      const img = e.target;
      const isMangaImg = img.closest('.reading-content, .reading-detail, #image-container, .chapter_content');
      if (isMangaImg) {
        if (!img.dataset.mangaOriginalSrc && img.src && !img.src.includes('placeholder')) {
          img.dataset.mangaOriginalSrc = img.src;
        }
        // Dừng sự kiện truyền xuống TruyenQQ
        e.stopImmediatePropagation();
      }
    }
  }, true);

  // =========================================================================
  // 6. Tự động triệt hạ modal Anti-AdBlock & Mở khóa cuộn trang (Body lock)
  // =========================================================================
  function unlockReader() {
    const notice = document.getElementById('reader-notice');
    if (notice) notice.remove();

    if (document.body && document.body.classList.contains('reader-locked')) {
      document.body.classList.remove('reader-locked');
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    }
  }

  const observer = new MutationObserver(unlockReader);
  if (document.documentElement) {
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    });
  }

  // =========================================================================
  // 7. Chặn Fetch & XMLHttpRequest tới máy chủ quảng cáo (Network-level in Userscript)
  // =========================================================================
  const BLOCKED_DOMAINS = [
    'e-embed.mangadex.org', '/embed/external/ads.html', '/temp/',
    'bundleunum.com', 'traffictop.net', 'syndication.exdynsrv.com',
    'exoclick.com', 'juicyads.com', 'trafficjunky.com', 'popads.net',
    'popcash.net', 'adsco.re', 'histats.com', 'mgid.com',
    'trialhd.com', 'sadbaguette.com', 'chilihandshakewing.com',
    'poweredby.jads.co', 'janitorprecisiontrio.com', 'frozenpayerpregnant.com',
    'clammyendearedkeg.com', 'guidepaparazzisurface.com', 'acquiredeceasedundress.com',
    'darnobedienceupscale.com', '/api/_/popunder', 'tsyndicate.com',
    'ero-advertising.com', 'theporndude.com'
  ];

  const origFetch = window.fetch;
  window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
    const u = url.toLowerCase();
    if (BLOCKED_DOMAINS.some(d => u.includes(d))) {
      return Promise.reject(new Error('[Manga Pro] Blocked ad fetch: ' + u));
    }
    return origFetch.apply(this, arguments);
  };

  const origOpenXHR = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (typeof url === 'string') {
      const u = url.toLowerCase();
      if (BLOCKED_DOMAINS.some(d => u.includes(d))) {
        this.send = function () {};
        return;
      }
    }
    return origOpenXHR.apply(this, arguments);
  };

  console.info('[Manga Pro] Universal Runtime JS Hooked & Anti-Adblock Defeated (Userscript Mode)');
})();
