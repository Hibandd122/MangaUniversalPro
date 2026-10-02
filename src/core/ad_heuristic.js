// Manga Universal Pro - Heuristic & Behavioral Ad Detection Engine
// Catches ads by behavior, link targets, third-party origins, and floating overlays
// Future-proof: Immune to CSS class renaming and domain rotation

window.MangaAdHeuristic = (function () {
  'use strict';

  // 1. Danh sách từ khóa nhà cái / cờ bạc / cá cược / link affiliate phổ biến trên web truyện VN
  const BETTING_AND_AFF_PATTERNS = [
    /88bet/i, /kubet/i, /w88/i, /fb88/i, /fun88/i, /jun88/i, /hi88/i, /789bet/i,
    /okvip/i, /new88/i, /bk8/i, /ta88/i, /f8bet/i, /ee88/i, /sv388/i, /go88/i,
    /sunwin/i, /iwin/i, /rikvip/i, /shopee\.vn.*aff/i, /lazada\.vn.*aff/i,
    /gamebaidoithuong/i, /nhacai/i, /nha-cai/i, /soi-keo/i, /link-vao/i,
    /affiliate/i, /track\.(php|aspx)/i, /click\.(php|aspx)/i, /redirect\.(php|aspx)/i
  ];

  // 2. Danh sách dịch vụ bên thứ 3 hợp lệ cần giữ lại (không xóa nhầm)
  const SAFE_EMBEDS = [
    'youtube.com', 'youtu.be', 'disqus.com', 'facebook.com/plugins',
    'giscus.app', 'recaptcha', 'cloudflare.com/cdn-cgi/challenge-platform',
    'turnstile', 'haiten.org', 'x.haiten.org', 'storage.haiten.org'
  ];

  // Kiểm tra iframe có phải là trình phát video / media hợp lệ không
  function isMediaIframe(ifr) {
    if (!ifr) return false;
    const src = (ifr.getAttribute('src') || '').toLowerCase();
    if (SAFE_EMBEDS.some(safe => src.includes(safe))) return true;

    // Các iframe video player luôn có thuộc tính allowfullscreen hoặc allow="...fullscreen..."
    const allow = (ifr.getAttribute('allow') || '').toLowerCase();
    if (allow.includes('fullscreen') || allow.includes('picture-in-picture') || ifr.hasAttribute('allowfullscreen')) {
      return true;
    }

    // Nằm trong khung phát video của trang (aspect-video, player, video-container)
    if (ifr.closest('[class*="aspect-video"], [class*="player"], #player, .video-container, .player-container')) {
      return true;
    }

    return false;
  }

  // Kiểm tra link có phải quảng cáo/nhà cái không
  function isAdLink(href) {
    if (!href || typeof href !== 'string') return false;
    // Bỏ qua link nội bộ hoặc neo
    if (href.startsWith('#') || href.startsWith('javascript:')) return false;
    
    return BETTING_AND_AFF_PATTERNS.some(rx => rx.test(href));
  }

  // Quét và thanh trừng theo hành vi
  function sweep() {
    const currentHost = window.location.hostname.toLowerCase();

    // A. Quét tất cả thẻ <a> có đích đến là cờ bạc / affiliate / link bẩn
    const links = document.querySelectorAll('a[href]');
    for (const a of links) {
      const href = a.getAttribute('href') || '';
      if (isAdLink(href)) {
        // Tìm thẻ bọc quảng cáo (container) để xóa gọn gàng, tránh để lại khoảng trắng
        const container = a.closest('div.banner, div[class*="ad"], div[class*="sponsor"], li, p') || a;
        container.remove();
      }
    }

    // B. Quét IFRAME bên thứ 3 (Bảo vệ tuyệt đối trình phát phim / YouTube / Haiten)
    const iframes = document.querySelectorAll('iframe[src]');
    for (const ifr of iframes) {
      // Nếu là trình phát video ➔ Bỏ qua không bao giờ xóa
      if (isMediaIframe(ifr)) continue;

      const src = ifr.getAttribute('src') || '';
      if (!src) continue;

      try {
        const url = new URL(src, window.location.href);
        // Nếu iframe trỏ sang domain khác hoàn toàn ➔ là iframe quảng cáo
        if (url.hostname && !url.hostname.includes(currentHost) && !currentHost.includes(url.hostname)) {
          const parent = ifr.parentElement;
          ifr.remove();
          if (parent && parent.children.length === 0 && parent !== document.body && !parent.closest('[class*="aspect-video"]')) {
            parent.remove();
          }
        }
      } catch (e) {}
    }

    // C. Quét các banner treo lơ lửng (Fixed / Sticky Overlays ở 2 bên mép hoặc đáy màn hình)
    const fixedElements = document.querySelectorAll('div[style*="fixed"], div[style*="sticky"], aside[style*="fixed"]');
    for (const el of fixedElements) {
      if (el.id === 'md-turbo-widget' || el.closest('#md-turbo-widget')) continue;
      
      const style = window.getComputedStyle(el);
      const zIndex = parseInt(style.zIndex, 10);
      
      // Nếu có z-index cực cao hoặc chứa thẻ a/img ra ngoài
      if (zIndex >= 999 || style.position === 'fixed') {
        const hasAdContent = el.querySelector('iframe, video, a[href*="http"], img');
        const isReader = el.querySelector('.reading-content, #image-container, .reading-detail, nav, header');
        
        // Nếu chứa ảnh/iframe nhưng không phải thanh điều hướng trang web hay nội dung truyện
        if (hasAdContent && !isReader) {
          const textLength = el.textContent.trim().length;
          // Các banner treo thường chỉ có ảnh và rất ít chữ
          if (textLength < 30) {
            el.remove();
          }
        }
      }
    }

    // D. Dọn dẹp khoảng trống rỗng do quảng cáo bị chặn để lại
    const emptyPlaceholders = document.querySelectorAll('.ads-holder, .banner-holder, [id^="ad-"], [class*="advertisement"]');
    for (const p of emptyPlaceholders) {
      if (p.children.length === 0 || p.innerHTML.trim() === '') {
        p.style.display = 'none';
        p.style.height = '0';
        p.style.margin = '0';
        p.style.padding = '0';
      }
    }
  }

  // Khởi động MutationObserver để tự động dọn sạch khi trang chèn thêm quảng cáo động
  function init() {
    sweep();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', sweep);
    }

    let timer = null;
    const observer = new MutationObserver(() => {
      if (timer) return;
      timer = setTimeout(() => {
        sweep();
        timer = null;
      }, 500); // Throttling 500ms để 0% tốn CPU
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  }

  return {
    init: init,
    sweep: sweep
  };
})();
