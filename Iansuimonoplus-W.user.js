// ==UserScript==
// @name         Iansuimonoplus-W 全網字型替換
// @namespace    https://github.com/JackalZheng/Iansuimonoplus-W
// @version      5.01
// @description  全網中英日韓字型統一為 Iansuimonoplus-W
// @author       JackalZheng
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // ====== 可自訂參數區 ======
    const FONT_NAME = 'Iansuimonoplus-W';
    const FONT_URL = 'https://github.com/JackalZheng/Iansuimonoplus-W/raw/refs/heads/main/Iansuimonoplus-W-Regular.woff2';

    const fontStrokeWidth = 0.3;
    const fontStrokeColor = 'rgba(0,0,0,0.15)';
    const fontShadowLight = '1px 1px 1.5px rgba(0,0,0,0.25)';
    const fontShadowDark = '1px 1px 1.5px rgba(255,255,255,0.15)';
    const fontSmooth = 'antialiased';
    const editPageKeywords = [
        'edit', 'editor', 'write', 'compose', 'admin', 'dashboard', 'blob', 'app', 'generate'
    ];
    const editPattern = new RegExp(`/(${editPageKeywords.join('|')})\\b`, 'i');

    // icon/symbol 字型
    const iconFonts = [
        'Apple Symbols', 'Bootstrap Icons', 'Font Awesome', 'Ionicons',
        'Material Icons', 'Noto Color Emoji', 'SF Pro Icons', 'Segoe Fluent Icons',
        'Segoe MDL2 Assets', 'Segoe UI Symbol', 'Apple Color Emoji', 'EmojiOne',
        'FontAwesome', 'Glyphicons', 'Google Symbols', 'Material Symbols',
        'Microsoft JhengHei', 'Segoe UI Emoji', 'Symbola', 'Twemoji', 'iconfont'
    ];

    // icon/symbol class（包含前綴）
    const iconClassList = [
        'icon', 'symbol', 'fa-', 'material-icons', 'gm2-', 'maps-sprite', 'icon-fluent',
        'music', 'video', 'audio', 'control', 'play', 'prev', 'next',
        'musicControlIcon', 'musicControl_play', 'musicBox', 'musicTime', 'musicSpeedControl', 'musicSpeedBox', 'speedSet'
    ];

    // 常見文字元素
    const textElements = [
        'body', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'li', 'td', 'th', 'label', 'a', 'div', 'input',
        'textarea', 'span', 'em', 'strong', 'info', 'b', 'u', 'i'
    ];

    // unicode 範圍
    const UNICODE_RANGE =
        "U+0020-007E" +
        "U+00A0-00FF" +
        "U+2E80-2EFF" +
        "U+3000-303F" +
        "U+3040-309F" +
        "U+30A0-30FF" +
        "U+4E00-9FFF" +
        "U+AC00-D7AF";

    // Emoji unicode 範圍
    const EMOJIS_UNICODE_RANGE =
        "U+200C, U+200D, U+203C, U+2049, " +
        "U+20E3, U+2139, U+2190-21FF, U+23??, U+24C2, " +
        "U+25A0-27BF, U+2B??, U+2934, U+2935, U+3030, U+303D, " +
        "U+3297, U+3299, U+FE0E, U+FE0F, U+1F???";

    // 若為編輯頁面則不作用
    if (editPattern.test(location.pathname)) return;

    // --------- 排除 icon/symbol class 的 CSS 選擇器 ---------
    // 完整 class
    const iconClassSelectors = iconClassList.map(cls => `.${cls}`);
    // 前綴 class（支援 [class^=]、[class*=]）
    const iconPrefixSelectors = iconClassList
        .filter(cls => cls.endsWith('-'))
        .map(cls => `[class^="${cls}"], [class*=" ${cls}"]`);
    // 合併所有排除選擇器
    const iconSelectors = iconClassSelectors.concat(iconPrefixSelectors).join(', ');
const isMobile = window.innerWidth <= 768; // 判斷是否為手機
const fontFamily = isMobile ? `''` : ` sans-serif, ${iconFonts.join(', ') }`;

    // --------- 樣式表內容 ---------
    const styleContent = `

@font-face {
  font-family: '${FONT_NAME}';
  src: local('${FONT_NAME}'), url('${FONT_URL}') format('woff2');
  font-display: swap;
  unicode-range: U+0020-007E, U+00A0-00FF, U+2E80-2EFF, U+3000-303F,
                 U+3040-309F, U+30A0-30FF, U+4E00-9FFF, U+AC00-D7AF;
}

/* 2. 主要文字元素統一字型與樣式 */
  ${textElements.join(', ')}:not(${iconSelectors}) {
    font-family: ${FONT_NAME} , ${fontFamily} !important;
  font-size-adjust: cap-height 0.69 !important;
  -webkit-font-smoothing: ${fontSmooth} !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility !important;
  text-shadow: ${fontShadowLight};
  -webkit-text-stroke-width: ${fontStrokeWidth}px;
  -webkit-text-stroke-color: ${fontStrokeColor};
}

/* 為 icon 類元素恢復原始字型 */
${iconSelectors} {
  font-family: ${iconFontFamilies.join(', ')}, inherit !important;
}

`;

    // --------- 注入樣式 ---------
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = styleContent;
    document.head.appendChild(style);

})();
