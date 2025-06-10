// ==UserScript==
// @name         Iansuimonoplus-W 全網字型替換
// @namespace    https://github.com/JackalZheng/Iansuimonoplus-W
// @version      5.04
// @description  全網中英日韓字型統一為 Iansuimonoplus-W
// @author       JackalZheng
// @match        *://*/*
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// ==/UserScript==

// 字體替換主函數
function changeFont(s_font, mode) {
    if (!s_font) return;

    const CSS_FONT_RULE = `
*:not([class*="icon"]):not([class*="fa"]):not([class*="logo"]):not([class*="mi"]):not([class*="hwic"]):not([class*="code"]):not(i) {
    font-family: ${s_font},Arial,"Material Icons Extended",stonefont,iknow-qb_share_icons,review-iconfont,mui-act-font,fontAwesome,tm-detail-font,office365icons,MWF-MDL2,global-iconfont,"Bowtie",myfont,sans-serif !important;
}`;

    const CSS_SIMPLE_RULE = `
*:not(i):not([class*="icon"]):not([class*="fa"]):not([class*="logo"]):not([class*="mi"]):not([class*="code"]) {
    font-family: ${s_font},Arial,"Material Icons Extended";
}`;

    // 輔助函數：新增 style 元素
    const addFontStyle = (css, id = 'modCSS_font') => {
        let style = document.querySelector(id ? `#${id}` : null);
        if (!style) {
            style = document.createElement('style');
            if (id) style.id = id;
            document.body.appendChild(style);
        }
        style.innerHTML = css;
    };

    // 輔助函數：新增 link 元素
    const addFontLink = (css) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'data:text/css,' + encodeURIComponent(css);
        document.documentElement.appendChild(link);
    };

    switch(mode) {
        case 0:
            addFontLink(CSS_FONT_RULE);
            break;
        case 1:
            setTimeout(() => addFontStyle(CSS_FONT_RULE), 300);
            break;
        case 2:
            addFontLink(CSS_FONT_RULE);
            setTimeout(() => addFontStyle(CSS_FONT_RULE.replace(',"Material Icons Extended",stonefont,iknow-qb_share_icons,review-iconfont,mui-act-font,fontAwesome,tm-detail-font,office365icons,MWF-MDL2,global-iconfont,"Bowtie",myfont,sans-serif', '')), 300);
            break;
        case 3:
            addFontLink(CSS_SIMPLE_RULE);
            setTimeout(() => addFontStyle(CSS_SIMPLE_RULE), 300);
            break;
    }
}

// 字體載入與樣式設定
(function() {
    // ====== 可自訂參數區 ======
    const FONT_NAME = 'Iansuimonoplus-W';
    const FONT_URL = 'https://github.com/JackalZheng/Iansuimonoplus-W/raw/refs/heads/main/Iansuimonoplus-W-Regular.woff2';

    const fontStrokeWidth = 0.3;
    const fontStrokeColor = 'rgba(0,0,0,0.15)';
    const fontShadowLight = '1px 1px 1.5px rgba(0,0,0,0.25)';
    const fontShadowDark = '1px 1px 1.5px rgba(255,255,255,0.15)';
    const fontSmooth = 'antialiased';
    // --------- 樣式表內容 ---------
    const styleContent = `
@font-face {
    font-family: 'Iansuimonoplus-W';
    src: local('Iansuimonoplus-W'), url('${FONT_URL}') format('woff2');
    font-display: swap;
}
* {
    font-size-adjust: cap-height 0.7 !important;
    -webkit-font-smoothing: ${fontSmooth} !important;
    -moz-osx-font-smoothing: grayscale !important;
    text-rendering: optimizeLegibility !important;
    text-shadow: ${fontShadowLight};
    -webkit-text-stroke-width: ${fontStrokeWidth}px;
    -webkit-text-stroke-color: ${fontStrokeColor};
}
    `;
    // 新增字體樣式
    const addFontStyle = (css, id = null) => {
        let style = document.querySelector(id ? `#${id}` : null);
        if (!style) {
            style = document.createElement('style');
            if (id) style.id = id;
            document.body.appendChild(style);
        }
        style.innerHTML = css;
    };
    addFontStyle(styleContent);
    // 更改字體
    changeFont(FONT_NAME, 2);
})();



