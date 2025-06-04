// ==UserScript==
// @name         Iansuimonoplus-W 全站字型替換
// @namespace    https://github.com/JackalZheng/Iansuimonoplus-W
// @version      3.1
// @description  全站中英日韓字型統一為 Iansuimonoplus-W，支援 emoji，分桌機/手機字體大小，完全避開 icon/symbol 類型字型與 class，排除編輯頁面，動態監控 DOM
// @author       JackalZheng
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  // ====== 可自訂參數區 ======
        // 字體縮放比例（1為正常大小）
    const fontScale = 1.0;
        // 判斷是否為手機
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // 設定字體大小
    const fontSize = isMobile ? 'calc(${fontScale} + 0.6px)' : 'calc(${fontScale})';

    // 字體描邊寬度(px)，0為無描邊
    const fontStrokeWidth = 0.3;
    // 字體描邊顏色
    const fontStrokeColor = 'rgba(0, 0, 0, 0.15)';
    // 字體陰影，格式：offset-x offset-y blur-radius color
    const fontShadow = '1px 1px 1.5px rgba(0, 0, 0, 0.25)';
    // 字體平滑設置，webkit內核支持
    const fontSmooth = 'subpixel-antialiased'; // 可用值: none, antialiased, subpixel-antialiased

  const editPageKeywords = [
    'edit', 'editor', 'write', 'compose', 'admin', 'dashboard', 'blob', 'app', 'generate'
  ];
  const editPattern = new RegExp(`/(${editPageKeywords.join('|')})\\b`, 'i');

  // 常見 icon/symbol 字型
  const iconFontFamilies = [
    'FontAwesome', 'Material Icons', 'Material Symbols', 'Ionicons', 'iconfont', 'Google Symbols',
    'Glyphicons', 'Segoe UI Symbol', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji',
    'Twemoji', 'EmojiOne', 'Symbola', 'Google Sans', 'Product Sans', 'Roboto'
  ];

  // 常見 icon/symbol class
  const iconClassList = [
    'icon', 'symbol', 'fa-', 'material-icons', 'gm2-', 'maps-sprite',
    'music', 'video', 'audio', 'control', 'play', 'prev', 'next',
    'musicControlIcon', 'musicControl_play', 'musicBox', 'musicTime', 'musicSpeedControl', 'musicSpeedBox', 'speedSet'
  ];

  // 文字元素標籤
  const textElements = [
    'body', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'li', 'td', 'th', 'label', 'a', 'div', 'input',
    'textarea', 'span', 'em', 'strong', 'info', 'b', 'u'
  ];

  // Emoji unicode 範圍
  const EMOJIS_UNICODE_RANGE =
    "U+200C, U+200D, U+203C, U+2049, " +
    "U+20E3, " +
    "U+2139, " +
    "U+2190-21FF, " +
    "U+23??, " +
    "U+24C2, " +
    "U+25A0-27BF, " +
    "U+2B??, " +
    "U+2934, U+2935, " +
    "U+3030, U+303D, " +
    "U+3297, U+3299, " +
    "U+FE0E, U+FE0F, " +
    "U+1F???";

  // 若為編輯頁面則不作用
  if (editPattern.test(location.pathname)) return;

  // 注入自訂字型與 emoji 字型
  GM_addStyle(`
    @font-face {
      font-family: 'Iansuimonoplus-W';
      src: local('Iansuimonoplus-W'),
           url('https://github.com/JackalZheng/Iansuimonoplus-W/raw/refs/heads/main/Iansuimonoplus-W-Regular.woff2') format('woff2');
      font-display: swap;
      unicode-range: U+0020-007E, U+00A0-00FF, U+2E80-2EFF, U+3000-303F, U+3040-309F, U+30A0-30FF, U+4E00-9FFF, U+AC00-D7AF;
    }
    @font-face {
      font-family: "Color Emoji";
      src: local("Apple Color Emoji"), local("Noto Color Emoji"),
        local("Segoe UI Emoji");
      unicode-range: ${EMOJIS_UNICODE_RANGE};
    }
    @font-face {
      font-family: "Monochrome Emoji";
      src: local("Apple Monochrome Emoji"), local("Noto Emoji"),
        local("Segoe Fluent Icons"), local("Segoe MDL2 Assets");
      unicode-range: ${EMOJIS_UNICODE_RANGE};
    }
    @font-face {
      font-family: "Consolas";
      src: local("Iansuimonoplus-W");
    }
    @font-face {
      font-family: "Courier New";
      src: local("Iansuimonoplus-W");
    }
        @font-face {
      font-family: "Courier";
      src: local("Iansuimonoplus-W");
    }
    :root {
      --icon-font-family: "Color Emoji", "Monochrome Emoji";
      --generic-font-family: "Iansuimonoplus-W";
      --code-font-family: "Iansuimonoplus-W";
    }
  `);

  // 注入全站字型與平滑設定
  GM_addStyle(`
    ${textElements.join(',')} {
      font-family: 'Iansuimonoplus-W', 'Noto Sans CJK TC', 'Noto Sans', 'Microsoft JhengHei', 'Arial', 'sans-serif',
        'Material Icons', 'Material Symbols', 'FontAwesome', 'Segoe UI Symbol',
        'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Twemoji',
        'EmojiOne', 'Symbola', sans-serif !important;
                    font-size: ${fontSize} !important;
            -webkit-font-smoothing: ${fontSmooth} !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-shadow: ${fontShadow} !important;
            /* 字體描邊 */
            -webkit-text-stroke-width: ${fontStrokeWidth}px !important;
            -webkit-text-stroke-color: ${fontStrokeColor} !important;
    }

  `);

  // 判斷是否為 icon 字型
  function isIconFont(fontFamily) {
    if (!fontFamily) return false;
    return iconFontFamilies.some(f =>
      fontFamily.split(',').some(ff => ff.trim().replace(/['"]/g, '') === f)
    );
  }

      // 動態加大字體
function enlargeFont(node) {
    // 建立新的樣式表
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
        /* 針對粗體字的優化 */
        strong, b {
            font-weight: 600 !important;
            -webkit-text-stroke-width: ${fontStrokeWidth}px !important;
        }
    `;

    // 將樣式表加入到頁面中
    document.head.appendChild(style);
}


  // 判斷是否含有 icon/symbol 相關 class
  function hasIconClass(node) {
    if (!node.classList) return false;
    return iconClassList.some(keyword =>
      Array.from(node.classList).some(cls => cls.includes(keyword))
    );
  }

  // 判斷是否為文字元素
  function isTextElement(node) {
    return node.nodeType === 1 && textElements.includes(node.tagName.toLowerCase());
  }

  // 完整排除條件：偽元素content、content屬性、icon字型、icon class
  function shouldExclude(node) {
    try {
      const style = window.getComputedStyle(node);

      const before = window.getComputedStyle(node, '::before');
      const after = window.getComputedStyle(node, '::after');

      if ((before.content && before.content !== 'none' && !['normal', 'initial', 'inherit', 'unset'].includes(before.fontFamily)) ||
          (after.content && after.content !== 'none' && !['normal', 'initial', 'inherit', 'unset'].includes(after.fontFamily))) {
        return true;
      }

      if (style.content && style.content !== 'none' && !['normal', 'initial', 'inherit', 'unset'].includes(style.fontFamily)) {
        return true;
      }

      if (isIconFont(style.fontFamily)) return true;

      return false;
    } catch (e) {
      return false;
    }
  }



  // 初始處理所有文字元素
  function processAll() {
    document.querySelectorAll(textElements.join(',')).forEach(enlargeFont);
  }

  // 監聽 DOM 變動
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        try {
          if (node.nodeType === 1) {
            if (isTextElement(node)) enlargeFont(node);
            node.querySelectorAll && node.querySelectorAll(textElements.join(',')).forEach(enlargeFont);
          }
        } catch (e) {
          // 忽略錯誤
        }
      });
    }
  });

  // 等待頁面完全載入後執行
  window.addEventListener('load', () => {
    processAll();
    observer.observe(document.body, { childList: true, subtree: true });
  });

})();
