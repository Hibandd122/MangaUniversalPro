# 🛡️ Manga Universal Pro (Userscript)

> **Lá chắn quảng cáo & Điều hướng đọc truyện thông minh** hoạt động mượt mà trên mọi nền tảng: **Safari iOS (Userscripts / Stay / Orion)**, **Android (Kiwi / Brave / Firefox)** và **Desktop (Tampermonkey / Violentmonkey)**.

[![Install Userscript](https://img.shields.io/badge/Cài%20Đặt%20Ngay-1--Click%20Install-brightgreen?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/Hibandd122/MangaUniversalPro/main/MangaUniversalPro.user.js)
[![Version](https://img.shields.io/badge/Phiên%20Bản-v3.0.0-orange?style=for-the-badge)](https://github.com/Hibandd122/MangaUniversalPro)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## ✨ Tính Năng Nổi Bật

- 🚫 **Chặn sạch 100% quảng cáo**: Triệt tiêu banner nhà cái/cờ bạc, quảng cáo trượt 2 bên viền, lưới sản phẩm Shopee/Lazada Affiliate chèn giữa các trang truyện.
- 🛑 **Hóa giải Anti-Adblock & Popunder Trap**: Vô hiệu hóa bẫy kiểm tra `adsbygoogle`, `prebid`, chặn `window.open` tự nhảy tab khi bấm vào truyện.
- ⚡ **Tự động chuyển chap tức thì (0s chờ)**: Khi cuộn đọc truyện chạm đáy trang, tiện ích sẽ tự động nhảy mượt mà sang chương kế tiếp mà không hiển thị bất kỳ pop-up hay bộ đếm ngược nào.
- 🎥 **Bảo vệ khung phát video**: Giữ an toàn tuyệt đối cho các player iframe trên HentaiZ (`haiten.org`), Rule34Video (`#kt_player`), không bao giờ bị đơ *"Loading player..."*.
- 🪶 **Siêu nhẹ & 0% chiếm RAM**: Không tải trước hình ảnh ngầm, loại bỏ hoàn toàn hiện tượng văng tab hoặc giật lag trên iPhone / iPad.

---

## 🌐 Các Trang Web Đã Được Tối Ưu Sâu

| Nền Tảng | Địa Chỉ Web | Tính Năng Đặc Trị |
| :--- | :--- | :--- |
| **MangaDex** | `mangadex.org` | Chặn quảng cáo mồi, banner tài trợ, fallback postMessage |
| **Cửu Truyện** | `cuutruyen.net` | Diệt banner nhà cái, link affiliate, tự chuyển chap SPA |
| **TruyenQQ** | `truyenqq*.com`, `truyenqq*.vn` | Diệt popup toàn màn hình, lưới Shopee, phá khóa `reader-notice` |
| **NetTruyen** | `nettruyen*.*` | Triệt tiêu bẫy thông báo tắt Adblock, quảng cáo cố định |
| **nHentai** | `nhentai.net`, `nhentai.xxx`, `nhentai.to` | Chặn mạng lưới ExoClick, JuicyAds, Chaturbate |
| **HentaiZ** | `hentaiz.*`, `hentaiz.foo` | Xóa popunder nhảy tab, bảo vệ trình phát video `haiten.org` |
| **Rule34** | `rule34.xxx`, `rule34video.com` | Chặn video ads, bảo vệ player `#kt_player` |
| **Mọi web truyện khác** | `*/*chapter*`, `*/*truyen*`, `*/*manga*` | Bộ quét hành vi Heuristic tự động thanh trừng quảng cáo rác |

---

## 🚀 Hướng Dẫn Cài Đặt

### 1. iPhone / iPad (iOS & iPadOS)
1. Cài đặt tiện ích mở rộng **[Userscripts](https://apps.apple.com/app/userscripts/id1463298887)** hoặc **[Stay](https://apps.apple.com/app/stay-for-safari/id1591620924)** từ App Store.
2. Bật tiện ích trong **Cài đặt > Safari > Phần mở rộng**.
3. Bấm vào nút **[Cài Đặt Ngay](https://raw.githubusercontent.com/Hibandd122/MangaUniversalPro/main/MangaUniversalPro.user.js)** và chọn **Install**.

### 2. Android (Kiwi Browser / Firefox Nightly / Brave)
1. Cài đặt extension **[Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)** từ Chrome Web Store.
2. Bấm vào nút **[Cài Đặt Ngay](https://raw.githubusercontent.com/Hibandd122/MangaUniversalPro/main/MangaUniversalPro.user.js)** để cài đặt.

### 3. Máy Tính (Chrome / Edge / Firefox / Brave / Safari)
1. Cài đặt **[Tampermonkey](https://www.tampermonkey.net/)** hoặc **[Violentmonkey](https://violentmonkey.github.io/)**.
2. Bấm vào nút **[Cài Đặt Ngay](https://raw.githubusercontent.com/Hibandd122/MangaUniversalPro/main/MangaUniversalPro.user.js)** và xác nhận cài đặt.

---

## 📁 Cấu Trúc Mã Nguồn (Modular Architecture)

```
MangaUniversalPro/
├── MangaUniversalPro.user.js      # File nạp chính (Userscript Loader qua @require)
├── src/
│   ├── cosmetic.js                # Bơm CSS chặn quảng cáo tức thì
│   ├── inject.js                  # Chặn bẫy Anti-Adblock & lọc mạng XHR/Fetch
│   ├── content.js                 # Điều phối logic & Tự chuyển chap
│   ├── core/
│   │   └── ad_heuristic.js        # Bộ lọc hành vi nhận diện quảng cáo rác
│   └── adapters/                  # Module đặc trị cho từng website
│       ├── mangadex.js
│       ├── cuutruyen.js
│       ├── truyenqq.js
│       ├── nettruyen.js
│       ├── nhentai.js
│       ├── hentaiz.js
│       ├── rule34.js
│       └── generic.js
└── README.md
```

---

## 📄 Bản Quyền

Dự án được phát hành theo giấy phép **MIT License**.
