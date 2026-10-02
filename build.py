import os
import shutil
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(BASE_DIR, 'src')
USER_SCRIPT = os.path.join(BASE_DIR, 'MangaUniversalPro.user.js')
BUNDLE_SCRIPT = os.path.join(BASE_DIR, 'MangaUniversalPro.bundle.user.js')
G_DRIVE_DIR = r"G:\My Drive\Manga Universal Pro"

def bump_version():
    """Tự động tăng số version patch (vd: 3.0.1 -> 3.0.2) để Tampermonkey nhận diện cập nhật ngay"""
    import re
    for path in [USER_SCRIPT, BUNDLE_SCRIPT]:
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            match = re.search(r'// @version\s+(\d+\.\d+\.)(\d+)', content)
            if match:
                new_ver = f"{match.group(1)}{int(match.group(2)) + 1}"
                content = re.sub(r'// @version\s+\S+', f'// @version      {new_ver}', content)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"[OK] Đã tăng version {os.path.basename(path)} -> {new_ver}")

def set_github_repo(username='Hibandd122', repo='MangaUniversalPro', branch='main'):
    """Cập nhật đường dẫn GitHub trong MangaUniversalPro.user.js"""
    with open(USER_SCRIPT, 'r', encoding='utf-8') as f:
        content = f.read()

    import re
    content = re.sub(r'https://github.com/[^/]+/[^/\n]+', f'https://github.com/{username}/{repo}', content)
    content = re.sub(r'https://raw.githubusercontent.com/[^/]+/[^/]+/[^/]+/', f'https://raw.githubusercontent.com/{username}/{repo}/{branch}/', content)
    with open(USER_SCRIPT, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[OK] Đã cập nhật GitHub Repo: {username}/{repo} ({branch})")

def build_bundle():
    """Gộp toàn bộ src/ thành 1 file bundle offline hoàn chỉnh"""
    header = """// ==UserScript==
// @name         Manga Universal Pro (Offline Bundle)
// @namespace    https://github.com/mangadex
// @version      3.0.0
// @description  Chặn sạch 100% quảng cáo, popunder, nhảy tab, vượt Anti-Adblock và tự động chuyển chương tiếp theo
// @author       Manga Pro Team
// @match        *://*.mangadex.org/*
// @match        *://*.cuutruyen.net/*
// @match        *://*.truyenqq*.*/*
// @match        *://*.tvtruyen.*/*
// @match        *://*.nettruyen*.*/*
// @match        *://*.blogtruyen*.*/*
// @match        *://*.nhentai.net/*
// @match        *://*.nhentai.xxx/*
// @match        *://*.nhentai.to/*
// @match        *://*.hentaiz.*/*
// @match        *://hentaiz.*/*
// @match        *://*.rule34.xxx/*
// @match        *://rule34.xxx/*
// @match        *://*.rule34video.com/*
// @match        *://rule34video.com/*
// @match        *://*/*chapter*
// @match        *://*/*truyen*
// @match        *://*/*manga*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
"""

    footer = """
})();
"""

    files = [
        os.path.join(SRC_DIR, 'cosmetic.js'),
        os.path.join(SRC_DIR, 'inject.js'),
        os.path.join(SRC_DIR, 'core', 'ad_heuristic.js'),
        os.path.join(SRC_DIR, 'adapters', 'generic.js'),
        os.path.join(SRC_DIR, 'adapters', 'mangadex.js'),
        os.path.join(SRC_DIR, 'adapters', 'cuutruyen.js'),
        os.path.join(SRC_DIR, 'adapters', 'truyenqq.js'),
        os.path.join(SRC_DIR, 'adapters', 'nettruyen.js'),
        os.path.join(SRC_DIR, 'adapters', 'nhentai.js'),
        os.path.join(SRC_DIR, 'adapters', 'hentaiz.js'),
        os.path.join(SRC_DIR, 'adapters', 'rule34.js'),
        os.path.join(SRC_DIR, 'content.js')
    ]

    with open(BUNDLE_SCRIPT, 'w', encoding='utf-8') as out:
        out.write(header)
        for fp in files:
            out.write(f"\n// ==================== {os.path.basename(fp)} ====================\n")
            with open(fp, 'r', encoding='utf-8') as sf:
                out.write(sf.read())
                out.write("\n")
        out.write(footer)

    print(f"[OK] Đã tạo file bundle offline: {BUNDLE_SCRIPT} ({os.path.getsize(BUNDLE_SCRIPT)} bytes)")

def sync_to_gdrive():
    """Đồng bộ userscript sang Google Drive"""
    if os.path.exists(r"G:\My Drive"):
        os.makedirs(G_DRIVE_DIR, exist_ok=True)
        shutil.copy2(USER_SCRIPT, G_DRIVE_DIR)
        shutil.copy2(USER_SCRIPT, r"G:\My Drive")
        if os.path.exists(BUNDLE_SCRIPT):
            shutil.copy2(BUNDLE_SCRIPT, G_DRIVE_DIR)
            shutil.copy2(BUNDLE_SCRIPT, r"G:\My Drive")
        print(f"[OK] Đã đồng bộ sang Google Drive: {G_DRIVE_DIR}")

if __name__ == '__main__':
    if '--bump' in sys.argv:
        bump_version()
    elif len(sys.argv) > 1 and not sys.argv[1].startswith('-'):
        user = sys.argv[1]
        repo = sys.argv[2] if len(sys.argv) > 2 else 'MangaUniversalPro'
        set_github_repo(user, repo)
    build_bundle()
    sync_to_gdrive()

