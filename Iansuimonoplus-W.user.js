// ==UserScript==
// @name         Iansuimonoplus-W 全站字型替換
// @namespace    https://github.com/JackalZheng/Iansuimonoplus-W
// @version      4.0
// @description  全站中英日韓字型統一為 Iansuimonoplus-W
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
  const fontScale = 1;
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
      'Apple Color Emoji', 'Arial', 'EmojiOne', 'FontAwesome', 'Glyphicons',
      'Google Sans', 'Google Symbols', 'Ionicons', 'Material Icons', 'Material Symbols',
      'Microsoft JhengHei', 'Noto Color Emoji', 'Noto Sans', 'Product Sans',
      'Roboto', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Symbola', 'Twemoji',
      'iconfont', 'sans-serif', 'Noto Sans CJK TC'
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

      // unicode 範圍
  const UNICODE_RANGE =
        "U+0020-007E"+
        "U+00A0-00FF"+
        "U+2E80-2EFF"+
        "U+3000-303F"+
        "U+3040-309F"+
        "U+30A0-30FF"+
        "U+4E00-9FFF"+
        "U+AC00-D7AF";


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


    // 建立新的樣式表
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `

                ${textElements.join(',')} {
           src: local('Iansuimonoplus-W'),
           url('https://github.com/JackalZheng/Iansuimonoplus-W/raw/refs/heads/main/Iansuimonoplus-W-Regular.woff2') format('woff2');
           font-family: 'Iansuimonoplus-W', ${iconFontFamilies} !important;
           font-display: swap;
           unicode-range: ${UNICODE_RANGE};
            /* 字體調整 */
            font-size: ${fontSize} !important;
            -webkit-font-smoothing: ${fontSmooth} !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-shadow: ${fontShadow} !important;
            /* 字體描邊 */
            -webkit-text-stroke-width: ${fontStrokeWidth}px !important;
            -webkit-text-stroke-color: ${fontStrokeColor} !important;
    }

    /* icon/symbol class 排除：恢復瀏覽器預設 */
     ${iconClassList.join(',')}  {
      font-family: initial !important;
      font-size: initial !important;
      text-shadow: none !important;
      -webkit-text-stroke-width: 0 !important;
      -webkit-text-stroke-color: initial !important;
      font-style: initial !important;
      font-weight: initial !important;
      letter-spacing: initial !important;
    }

        /* 針對粗體字的優化 */
        strong, b {
            font-weight: 600 !important;
            -webkit-text-stroke-width: ${fontStrokeWidth}px !important;
        }
    `;




    // 將樣式表加入到頁面中
    document.head.appendChild(style);



})();
