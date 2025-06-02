// ==UserScript==
// @name         全站字型替換
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  全站中英日韓字型統一為 Iansuimonoplus-W，排除 icon 與編輯頁面，字體比原本大2px
// @author       J
// @downloadURL  https://github.com/JackalZheng/Iansuimonoplus-W/raw/refs/heads/main/Iansuimonoplus-W.user.js
// @updateURL    https://github.com/JackalZheng/Iansuimonoplus-W/raw/refs/heads/main/Iansuimonoplus-W.user.js
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 排除編輯頁面
    const editPattern = /\/(edit|editor|write|compose|admin|dashboard|blob)\b/i;
    if (editPattern.test(location.pathname)) return;

    // 注入自訂字型
    GM_addStyle(`
    @font-face {
        font-family: 'Iansuimonoplus-W';
        src: local('Iansuimonoplus-W'),
             url('https://github.com/JackalZheng/Iansuimonoplus-W/raw/refs/heads/main/Iansuimonoplus-W-Regular.woff2') format('woff2');
        font-display: swap;
        unicode-range: U+0020-007E, U+00A0-00FF, U+2E80-2EFF, U+3000-303F, U+3040-309F, U+30A0-30FF, U+4E00-9FFF, U+AC00-D7AF;
    }
    `);

    // 排除常見 icon/symbol 字型與 class
    const iconFontFamilies = [
        'FontAwesome', 'Material Icons', 'Material Symbols', 'Ionicons', 'iconfont', 'Glyphicons', 'Segoe UI Symbol',
        'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Twemoji', 'EmojiOne', 'Symbola',
        'Google Sans', 'Product Sans', 'Roboto'
    ];
    const iconFontSelector = iconFontFamilies.map(f =>
        `[style*="font-family:${f}"]`
    ).join(',');
    const iconClassSelector = [
        '[class*="icon"]',
        '[class*="symbol"]',
        '[class*="fa-"]',
        '[class*="material-icons"]',
        '[class*="gm2-"]',
        '[class*="maps-sprite"]'
    ].join(',');

    // 只針對常見文字元素
    const textElements = [
        'body', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'info',
        'li', 'td', 'th', 'label', 'a', 'div', 'input', 'textarea', 'button', 'span'
    ].join(',');

    // 字型與平滑設定
    GM_addStyle(`
    ${textElements}:not(${iconFontSelector}):not(${iconClassSelector}) {
        font-family: 'Iansuimonoplus-W', 'Noto Sans CJK TC', 'Noto Sans', 'Microsoft JhengHei', 'Arial', 'sans-serif' !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
    }
    `);

    // 動態加大 2px
    function enlargeFont(node) {
        // 排除 icon/symbol
        if (
            node.nodeType !== 1 ||
            node.matches(iconFontSelector) ||
            node.matches(iconClassSelector)
        ) return;

        // 只處理常見文字元素
        if (!node.matches(textElements)) return;

        const style = window.getComputedStyle(node);
        // 跳過已經被設過的
        if (node.dataset.fontEnlarged === "1") return;
        // 跳過隱藏元素
        if (style.display === "none" || style.visibility === "hidden") return;

        // 取得原始字級
        let size = style.fontSize;
        if (!size.endsWith('px')) return; // 只處理 px 單位
        let px = parseFloat(size);
        if (isNaN(px)) return;
        node.style.fontSize = (px + 0.5) + "px";
        node.dataset.fontEnlarged = "1";
    }

    // 初始處理
    function processAll() {
        document.querySelectorAll(textElements).forEach(enlargeFont);
    }

    // 監聽 DOM 變動
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches(textElements)) enlargeFont(node);
                    node.querySelectorAll && node.querySelectorAll(textElements).forEach(enlargeFont);
                }
            });
        }
    });

    processAll();
    observer.observe(document.body, { childList: true, subtree: true });

})();
