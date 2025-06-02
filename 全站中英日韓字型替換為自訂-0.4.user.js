// ==UserScript==
// @name         全站中英日韓字型替換為自訂
// @namespace    http://tampermonkey.net/
// @version      0.4
// @author       J
// @description  強制中英日韓字型為 Iansuimonoplus-W，排除 icon 與符號元素，字級動態調整(+2px)，字體平滑，支援 SPA，避免重複處理與字體越加越大問題
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // 判斷是否為中英日韓文字
    function isCJKorLatin(char) {
        const code = char.charCodeAt(0);
        return (
            (code >= 0x4E00 && code <= 0x9FFF) || // 中文
            (code >= 0x3040 && code <= 0x30FF) || // 日文
            (code >= 0xAC00 && code <= 0xD7AF) || // 韓文
            (code >= 0x0020 && code <= 0x007E)    // 英文
        );
    }

    // 判斷是否為符號或 emoji
    function isSymbolOrIcon(char) {
        const code = char.charCodeAt(0);
        return (
            (code >= 0x2000 && code <= 0x2FFF) ||
            (code >= 0x3000 && code <= 0x303F) ||
            (code >= 0x1F000 && code <= 0x1FAFF) ||
            (code >= 0x2600 && code <= 0x27BF)
        );
    }

    // 判斷是否含有 icon 類別
    function hasIconClass(node) {
        if (!node.classList) return false;
        const iconKeywords = ['icon', 'fa', 'material', 'glyph', 'map', 'emoji', 'sprite', 'logo', 'iconfont', 'gm2'];
        return [...node.classList].some(cls =>
            iconKeywords.some(kw => cls.toLowerCase().includes(kw))
        );
    }

    const excludedTags = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'IMG', 'SVG', 'BUTTON', 'INPUT']);

    // 記錄原始字體大小，避免重複遞增
    function getOriginalFontSize(element) {
        if (!element) return 16;
        const recorded = element.getAttribute('data-original-font-size');
        if (recorded) return parseFloat(recorded);
        const size = parseFloat(window.getComputedStyle(element).fontSize || '16');
        element.setAttribute('data-original-font-size', size);
        return size;
    }

    // 根據分類包裝文字段落
    function wrapBuffer(text, type, fontSize) {
        if (!text) return '';
        if (type === 'target') {
            const span = document.createElement('span');
            span.textContent = text;
            span.setAttribute('data-font-processed', 'true');
            span.setAttribute('style', `
                font-family: 'Iansuimonoplus-W', 'Microsoft JhengHei', 'Noto Sans CJK TC', sans-serif;
                src: local('Iansuimonoplus-W'), url('https://github.com/JackalZheng/Iansuimonoplus-W/raw/refs/heads/main/Iansuimonoplus-W-Regular.woff2') format('woff2');
                font-size: ${fontSize}px !important;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            `);
            return span.outerHTML;
        }
        return text;
    }

    // 遞迴遍歷節點
    function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const parent = node.parentNode;
            if (!parent || parent.hasAttribute('data-font-processed')) return;
            if (hasIconClass(parent) || excludedTags.has(parent.nodeName)) return;
            if (!/[A-Za-z0-9\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(node.nodeValue)) return;

            const originalSize = getOriginalFontSize(parent);
            const newFontSize = originalSize + 2;
            const text = node.nodeValue;

            let html = '';
            let buffer = '';
            let lastType = null;

            for (const char of text) {
                const isTarget = isCJKorLatin(char);
                const isSymbol = isSymbolOrIcon(char);
                const type = isSymbol ? 'symbol' : isTarget ? 'target' : 'other';

                if (type === lastType || lastType === null) {
                    buffer += char;
                } else {
                    html += wrapBuffer(buffer, lastType, newFontSize);
                    buffer = char;
                }
                lastType = type;
            }
            html += wrapBuffer(buffer, lastType, newFontSize);

            if (html !== text) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = html;
                wrapper.setAttribute('data-font-processed', 'true');
                parent.replaceChild(wrapper, node);
                return;
            }

        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (excludedTags.has(node.nodeName)) return;
            if (hasIconClass(node)) return;
            if (node.hasAttribute('data-font-processed')) return;

            for (let i = 0; i < node.childNodes.length; i++) {
                traverseNodes(node.childNodes[i]);
            }
        }
    }

    // 全站強制 CSS
    GM_addStyle(`
        html, body, *:not(i):not(svg):not([role="img"]):not([aria-hidden="true"]):not([class*="icon"]):not([class*="material-icons"]) {
            font-family: "Iansuimonoplus-W", "Microsoft JhengHei", "Noto Sans CJK TC", sans-serif !important;
            src: local('Iansuimonoplus-W'), url('https://github.com/JackalZheng/Iansuimonoplus-W/raw/refs/heads/main/Iansuimonoplus-W-Regular.woff2') format('woff2');
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }
    `);

    // 初始化處理
    function applyToPage() {
        traverseNodes(document.body);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        applyToPage();
    } else {
        window.addEventListener('DOMContentLoaded', applyToPage);
    }

    // MutationObserver - 僅監聽新增節點
    let scheduled = false;
    const observer = new MutationObserver(mutations => {
        if (scheduled) return;
        scheduled = true;
        setTimeout(() => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        traverseNodes(node);
                    }
                }
            }
            scheduled = false;
        }, 100);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
