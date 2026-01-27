// ==UserScript==

// @name         全網頁替換字體 (繞過 CSP 限制版)

// @namespace    http://tampermonkey.net/

// @version      1.1

// @description  使用 @resource 繞過 Yahoo 等網站的 CSP 限制

// @author       Gemini

// @match        *://*/*

// @grant        GM_addStyle

// @grant        GM_getResourceURL

// @resource     MY_FONT https://github.com/JackalZheng/Iansuimonoplus-W/raw/refs/heads/main/Iansuimonoplus-W-Regular.woff2

// @run-at       document-start

// ==/UserScript==

(function() {

    'use strict';

    // 取得預載入字體的 Data URL (Base64)

    const fontUrl = GM_getResourceURL('MY_FONT');

    const fontName = 'IansuimonoplusW';

    const css = `

        @font-face {

            font-family: '${fontName}';

            src: url('${fontUrl}') format('woff2');

            font-display: swap;

        }

        /* 強制套用到所有元素，並針對 Yahoo 等複雜結構加強覆蓋 */

        html, body, p, div, span, a, input, button, textarea, section, article, h1, h2, h3, h4, h5, h6 {

            font-family: '${fontName}', system-ui, -apple-system, "Microsoft JhengHei", sans-serif !important;

        }

    `;

    // 使用 Tampermonkey 專用的 API 注入樣式，權限更高

    GM_addStyle(css);

})();
