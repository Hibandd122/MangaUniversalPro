// Manga Universal Pro - Pure AdShield & Anti-Adblock Master
// 100% Focused on Ad Blocking, Popunder Defense & Anti-Adblock Defeat

(function () {
  'use strict';

  // 1. Kiểm tra danh sách tên miền cần bỏ qua (đảm bảo 0% chiếm tài nguyên trên Google, FB, v.v.)
  const IGNORED_DOMAINS = [
    'google.', 'facebook.', 'youtube.', 'github.', 'twitter.', 'x.com',
    'reddit.', 'wikipedia.', 'microsoft.', 'bing.', 'yahoo.', 'amazon.'
  ];

  const currentHost = window.location.hostname.toLowerCase();
  if (IGNORED_DOMAINS.some(d => currentHost.includes(d))) {
    return;
  }

  // 2. Tìm Adapter phù hợp với web hiện tại
  function getActiveAdapter() {
    const host = window.location.hostname.toLowerCase();
    const adapters = window.MangaAdapters || {};
    for (const key in adapters) {
      if (key !== 'generic') {
        const adp = adapters[key];
        if (typeof adp.match === 'function' && adp.match()) {
          return adp;
        }
        if (host.includes(key)) {
          return adp;
        }
      }
    }
    const path = window.location.pathname.toLowerCase();
    const isMangaSite = ['manga', 'comic', 'truyen', 'chapter', 'chap', 'read', 'chuong', 'hentai'].some(w => host.includes(w) || path.includes(w));
    if (isMangaSite) {
      return adapters['generic'] || null;
    }
    return null;
  }

  const adapter = getActiveAdapter();
  if (!adapter) return;

  console.info(`[Manga Universal Pro] Kích hoạt Lá chắn Quảng cáo cho: ${adapter.name}`);

  // 3. Chặn quảng cáo, Popunder & Banner tài trợ
  function purgeAds() {
    if (typeof adapter.purgeAds === 'function') {
      adapter.purgeAds();
    }
    if (window.MangaAdHeuristic) {
      window.MangaAdHeuristic.sweep();
    }
  }

  // Khởi động Heuristic Ad Sweeper (Tự động thanh trừng theo hành vi, chống đổi tên class)
  if (window.MangaAdHeuristic) {
    window.MangaAdHeuristic.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', purgeAds);
  } else {
    purgeAds();
  }

  // 4. Theo dõi DOM động (SPA route changes, Vue/Nuxt/Svelte router)
  const obs = new MutationObserver(() => {
    purgeAds();
  });

  obs.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // 5. TỰ ĐỘNG CHUYỂN CHƯƠNG TIẾP THEO (Auto-Next Chapter Engine - Siêu nhẹ, 0% Lag)
  function setupAutoNextChapter() {
    // Chỉ kích hoạt khi đang ở trang đọc truyện / xem nội dung
    const isReading = typeof adapter.isReader === 'function' ? adapter.isReader() : true;
    if (!isReading) return;

    let isNavigating = false;
    let lastUrl = window.location.href;

    // Reset cờ khi trang SPA chuyển URL
    setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        isNavigating = false;
      }
    }, 500);

    function findNextTarget() {
      // 1. Dò theo danh sách selector tối ưu riêng của từng web
      const selectors = adapter.nextChapterSelectors || [];
      for (const sel of selectors) {
        try {
          const el = document.querySelector(sel);
          if (el) {
            if (el.tagName === 'A' && el.href && !el.href.endsWith('#') && !el.href.startsWith('javascript:')) {
              if (el.href !== window.location.href) {
                return { element: el, url: el.href };
              }
            } else if (typeof el.click === 'function') {
              return { element: el, url: null };
            }
          }
        } catch (e) {}
      }

      // 2. Dự phòng: Tìm thẻ select chứa danh sách chapter
      try {
        const select = document.querySelector('select.select-chapter, select[id*="chapter"], select[class*="chapter"]');
        if (select && select.selectedIndex >= 0) {
          const currOpt = select.options[select.selectedIndex];
          if (select.selectedIndex < select.options.length - 1) {
            const nextOpt = select.options[select.selectedIndex + 1];
            if (nextOpt && nextOpt.value && nextOpt.value !== currOpt.value) {
              const url = nextOpt.value.startsWith('http') ? nextOpt.value : (window.location.origin + nextOpt.value);
              return { element: select, url: url, isSelect: true, nextIndex: select.selectedIndex + 1 };
            }
          }
        }
      } catch (e) {}

      // 3. Dự phòng chung: a[rel="next"], link[rel="next"]
      try {
        const relNext = document.querySelector('a[rel="next"], a.next, a.btn-next, a.next_chapter');
        if (relNext && relNext.href && relNext.href !== window.location.href) {
          return { element: relNext, url: relNext.href };
        }
      } catch (e) {}

      return null;
    }

    function navigateToTarget(target) {
      if (isNavigating) return;
      isNavigating = true;

      if (target.url) {
        window.location.href = target.url;
      } else if (target.isSelect && target.element) {
        target.element.selectedIndex = target.nextIndex;
        target.element.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (target.element && typeof target.element.click === 'function') {
        target.element.click();
      }
    }

    function triggerAutoNext() {
      if (isNavigating) return;
      const target = findNextTarget();
      if (!target) return;
      navigateToTarget(target);
    }

    // 6. Theo dõi thao tác cuộn đến cuối trang (Scroll to Bottom) -> Nhảy chap ngay tức thì (0s chờ)
    let isScrolling = false;
    window.addEventListener('scroll', () => {
      if (isScrolling || isNavigating) return;
      isScrolling = true;

      requestAnimationFrame(() => {
        isScrolling = false;
        const scrollDistanceToBottom = document.documentElement.scrollHeight - (window.innerHeight + window.scrollY);

        // Khi người đọc cuộn chạm cuối trang (còn dưới 120px)
        if (scrollDistanceToBottom <= 120) {
          triggerAutoNext();
        }
      });
    }, { passive: true });
  }

  // Khởi chạy Auto-Next khi DOM đã sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAutoNextChapter);
  } else {
    setupAutoNextChapter();
  }
})();

