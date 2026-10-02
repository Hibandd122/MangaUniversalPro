// Manga Universal Pro - Cosmetic CSS Injector
(function () {
  'use strict';

  const css = `/* Manga Universal Pro - Multi-Site Cosmetic AdBlocker */

/* 1. MangaDex Specific */
iframe[src*="e-embed.mangadex.org"],
iframe[src*="/embed/external/ads.html"],
video[src*="/temp/"],
img[src*="/temp/"],
a[href*="/advertise"],
a[href*="anime-gifs.com"],
a[href*="amazon.com?utm_source=md"],
a[href="/support-us"],
div:has(> video[src*="/temp/"]) {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  pointer-events: none !important;
}

/* 2. TruyenQQ & NetTruyen Specific */
iframe[src*="bundleunum"],
iframe[src*="traffictop"],
iframe[src*="adservice"],
iframe[src*="doubleclick"],
#image_popup,
#image_popup_mobile,
.image_popup,
#ads_mobile,
.ads_close_mobile,
#left-banner,
#right-banner,
#top-banner,
#bottom-banner,
#bottom_banner,
.ads_close,
.productafs,
.product-grid,
.product-item,
div:has(> .product-grid),
div:has(> .productafs),
a[href*="shopee.vn"],
a[href*="lazada.vn"],
.ads-holder,
.banner-holder,
.bottom-ads,
#floating-ad,
.middle-ads,
.ad_fixed,
.ad-container,
.box_ads,
.box-ads,
.banner-desktop,
.banner-mobile,
div[id^="ads"],
div[id*="ad_banner"],
div[id^="preload_ads"],
div[id^="preload_banner"],
div[style*="z-index: 2147483647"],
div[style*="z-index: 999999"]:not(#md-autonext-widget):not(#md-autonext-flash) {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  pointer-events: none !important;
}

/* 3. CuuTruyen Specific */
div[class*="sponsor"]:not([class*="manga"]):not([class*="chapter"]),
a[href*="affiliate"] {
  display: none !important;
}

/* 4. nHentai Specific */
iframe[src*="exoclick"],
iframe[src*="juicyads"],
iframe[src*="ero-advertising"],
iframe[src*="trafficjunky"],
iframe[src*="tsyndicate"],
iframe[src*="chaturbate"],
#ad-banner,
.ad-banner,
.advertisement,
#chaturbate-ad,
.banner-holder,
div[id^="ad_"],
div[class^="ad-"] {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  pointer-events: none !important;
}

/* 5. Bảo vệ tuyệt đối Video Player trên HentaiZ & Rule34 */
iframe[src*="haiten.org"],
iframe[allow*="fullscreen"],
div:has(> iframe[src*="haiten.org"]),
#kt_player,
.kt-player,
video.fp-engine,
#image,
#gelcomVideoPlayer {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}

/* 6. Rule34 Specific Ads */
.sidebar_ad_buttons,
.panel_header--promo,
iframe[src*="trialhd"],
iframe[src*="sadbaguette"],
iframe[src*="poweredby.jads.co"],
iframe[src*="chilihandshakewing"] {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  pointer-events: none !important;
}

/* 7. Triệt tiêu bảng thông báo Anti-Adblock (TruyenQQ & NetTruyen) */
#reader-notice,
.reader-notice,
.modal-adblock,
div[class*="adblock-notice"] {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  height: 0 !important;
  width: 0 !important;
}

body.reader-locked {
  overflow: auto !important;
  position: static !important;
  height: auto !important;
}

/* 8. Fix manga image spacing and prevent layout shifts */
.page-chapter,
.story-see-content,
.chapter_content {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
`;

  function injectCSS() {
    if (document.getElementById('manga-pro-cosmetic-css')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'manga-pro-cosmetic-css';
    styleEl.textContent = css;
    (document.head || document.documentElement).appendChild(styleEl);
  }

  if (document.head || document.documentElement) {
    injectCSS();
  } else {
    document.addEventListener('DOMContentLoaded', injectCSS);
  }
})();
