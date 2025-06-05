// ==UserScript==
// @name         Iansuimonoplus-W 全站字型替換
// @namespace    https://github.com/JackalZheng/Iansuimonoplus-W
// @version      4.2
// @description  全站中英日韓字型統一為 Iansuimonoplus-W，排除 icon/symbol 類別
// @author       JackalZheng
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // ====== 可自訂參數區 ======
    const fontStrokeWidth = 0.3;
    const fontStrokeColor = 'rgba(0, 0, 0, 0.15)';
    const fontShadow = '1px 1px 1.5px rgba(0, 0, 0, 0.25)';
    const fontSmooth = 'antialiased'; // 可用值: none, antialiased, subpixel-antialiased

    const editPageKeywords = [
        'edit', 'editor', 'write', 'compose', 'admin', 'dashboard', 'blob', 'app', 'generate'
    ];
    const editPattern = new RegExp(`/(${editPageKeywords.join('|')})\\b`, 'i');

    // icon/symbol 字型
    const iconFontFamilies = [
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
        'textarea', 'span', 'em', 'strong', 'info', 'b', 'u'
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

    // --------- 樣式表內容 ---------
    const styleContent = `
/* 1. 設定 html 載入自訂字型 */
html {
    font-family: 'Iansuimonoplus-W';
    src: local('Iansuimonoplus-W'),
         url('https://github.com/JackalZheng/Iansuimonoplus-W/raw/refs/heads/main/Iansuimonoplus-W-Regular.woff2') format('woff2');
    font-display: swap;
}

/* 2. 主要文字元素統一字型與樣式 */
${textElements.join(', ')} {
    font-family: 'Iansuimonoplus-W', ${iconFontFamilies.map(f => `'${f}'`).join(', ')} !important;
    font-size-adjust: cap-height 0.7 !important;
    -webkit-font-smoothing: ${fontSmooth} !important;
    -moz-osx-font-smoothing: grayscale !important;
    text-shadow: ${fontShadow} !important;
    -webkit-text-stroke-width: ${fontStrokeWidth}px !important;
    -webkit-text-stroke-color: ${fontStrokeColor} !important;
}

/* 3. emoji 範圍排除：用原生字型 */
* {
    font-family: inherit !important;
    unicode-range: ${EMOJIS_UNICODE_RANGE};
}

/* 4. 排除 icon/symbol class：恢復預設字型與樣式 */
${iconSelectors} {
    font-family: initial !important;
    font-size: initial !important;
    text-shadow: none !important;
    -webkit-text-stroke-width: 0 !important;
    -webkit-text-stroke-color: initial !important;
    font-style: initial !important;
    font-weight: initial !important;
    letter-spacing: initial !important;
}

/* 5. 強化粗體字 */
strong, b {
    font-weight: 600 !important;
    -webkit-text-stroke-width: ${fontStrokeWidth}px !important;
}
`;

    // --------- 注入樣式 ---------
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = styleContent;
    document.head.appendChild(style);

})();
