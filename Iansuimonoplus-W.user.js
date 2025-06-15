// ==UserScript==
// @name         Iansuimonoplus-W 全網字型替換
// @namespace    https://github.com/JackalZheng/Iansuimonoplus-W
// @version      5.12
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
    const FONT_NAME2 = 'Iansuimonoplus';
    const FONT_URL2 = 'https://github.com/JackalZheng/Iansuimonoplus/raw/refs/heads/main/Iansuimonoplus-Regular.woff2';

    const fontStrokeWidth = 0.3;
    const fontStrokeColor = 'rgba(0,0,0,0.15)';
    const fontShadowLight = '1px 1px 1.5px rgba(0,0,0,0.25)';
    const fontShadowDark = '1px 1px 1.5px rgba(255,255,255,0.15)';
    const fontSmooth = 'antialiased';

    // icon/symbol 字型
    const iconFonts = [
'Apple Color Emoji','Apple Symbols','Arial','Bootstrap Icons',
'Bowtie','EmojiOne','Font Awesome','FontAwesome',
'Glyphicons','Google Symbols','Ionicons','MWF-MDL2',
'Material Icons Extended','Material Icons','Material Symbols','Microsoft JhengHei',
'Noto Color Emoji','SF Pro Icons','Segoe Fluent Icons','Segoe MDL2 Assets',
'Segoe UI Emoji','Segoe UI Symbol','Symbola','Twemoji',
'fontAwesome','global-iconfont','iconfont','iknow-qb_share_icons',
'mui-act-font','myfont','office365icons','review-iconfont',
'stonefont','tm-detail-font','sans-serif'
    ];

    // icon/symbol class（包含前綴）
    const iconClassList = [
'audio','code','control','fa','fa-',
'gm2-','hwic','icon','icon-fluent','logo',
'maps-sprite','material-icons','mi','music','musicBox',
'musicControlIcon','musicControl_play','musicSpeedBox',
'musicSpeedControl','musicTime','next','play','stop',
'prev','speedSet','symbol','video'
    ];

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

@font-face {
  font-family: '$(FONT_NAME)';
  src: url('${FONT_URL}') format('woff2');
  font-display: swap;
}
@font-face {
  font-family: '$(FONT_NAME2)';
  src: url('${FONT_URL2}') format('woff2');
  font-display: swap;
}
/* 2. 主要文字元素統一字型與樣式 */
  *:not(${iconSelectors}) {
  font-family: ${FONT_NAME},${FONT_NAME2}, ${iconFonts} !important;
  font-size-adjust: cap-height 0.7 !important;
  -webkit-font-smoothing: ${fontSmooth} !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility !important;
  text-shadow: ${fontShadowLight} !important;
  -webkit-text-stroke-width: ${fontStrokeWidth}px !important;
  -webkit-text-stroke-color: ${fontStrokeColor} !important;
}

`;

    // --------- 注入樣式 ---------
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = styleContent;
    document.head.appendChild(style);

})();
