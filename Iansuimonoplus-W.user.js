// ==UserScript==
// @name         全站字型替換
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  全站中英日韓字型統一為 Iansuimonoplus-W，排除 icon 與編輯頁面，字體比原本大2px
// @author       J
// @downloadURL  https://github.com/JackalZheng/Iansuimonoplus-W/raw/refs/heads/main/Iansuimonoplus-W.user.js
// @updateURL    https://github.com/JackalZheng/Iansuimonoplus-W/raw/refs/heads/main/Iansuimonoplus-W.user.js
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  // 排除編輯頁面
  const editPattern = /\/(edit|editor|write|compose|admin|dashboard|blob|app|generate)\b/i;
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
    'FontAwesome', 'Material Icons', 'Material Symbols', 'Ionicons', 'iconfont', 'Google Symbols',
    'Glyphicons', 'Segoe UI Symbol', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji',
    'Twemoji', 'EmojiOne', 'Symbola', 'Google Sans', 'Product Sans', 'Roboto', 'sans-serif'
  ];
  const iconFontSelector = iconFontFamilies.map(f => `[style*="font-family:${f}"]`).join(',');
  const iconClassSelector = [
    '[class*="icon"]',
    '[class*="symbol"]',
    '[class*="fa-"]',
    '[class*="material-icons"]',
    '[class*="gm2-"]',
    '[class*="maps-sprite"]'
  ].join(',');

  // 針對常見文字元素
  const textElements = [
    'body', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'li', 'td', 'th', 'label', 'a', 'div', 'input',
    'textarea', 'button', 'span', 'em', 'strong', 'b', 'u', 'i', 'info'
  ].join(',');

  // 注入 CSS 字型與字體平滑設定
  GM_addStyle(`
    ${textElements} {
    font-family: 'Iansuimonoplus-W', 'Noto Sans CJK TC', 'Noto Sans', 'Microsoft JhengHei','Google Symbols',
    'Arial', 'sans-serif' ,'Material Icons', 'Material Symbols', 'FontAwesome',
    'Segoe UI Symbol', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Twemoji',
    'EmojiOne', 'Symbola', sans-serif !important;      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      text-rendering: optimizeLegibility !important;
    }

  `);

  // 動態加大字體 2px（實測建議加 0.5px）
  function enlargeFont(node) {
    if (
      node.nodeType !== 1 ||
      node.matches(iconFontSelector) ||
      node.matches(iconClassSelector) ||
      !node.matches(textElements) ||
      node.dataset.fontEnlarged === '1'
    ) return;

    const style = window.getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden') return;

    const size = style.fontSize;
    if (!size.endsWith('px')) return;

    const px = parseFloat(size);
    if (isNaN(px)) return;

    node.style.fontSize = (px + 0.5) + 'px';
    node.dataset.fontEnlarged = '1';
  }

  // 初始處理所有文字元素
  function processAll() {
    document.querySelectorAll(textElements).forEach(enlargeFont);
  }

  // 監聽 DOM 變動（動態插入文字也套用字型）
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
