// ==UserScript==
// @name         Grokipedia LaTeX Whitespace Fixer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Fixes space-padded $...$ LaTeX on Grokipedia with visual highlights and original-text tooltips
// @match        *://*.grokipedia.com/*
// @match        *://grokipedia.com/*
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // 1. Inject KaTeX CSS (if missing) + Custom Highlight & Tooltip Styles
    if (!document.querySelector('link[href*="katex"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';
        document.head.appendChild(link);
    }

    if (!document.getElementById('tm-katex-fixer-styles')) {
        const style = document.createElement('style');
        style.id = 'tm-katex-fixer-styles';
        style.textContent = `
            /* Subtle emerald tint for standard whitespace fixes */
            .tm-math-fixed {
                position: relative;
                background-color: rgba(16, 185, 129, 0.12);
                border-bottom: 1px dashed rgba(16, 185, 129, 0.65);
                border-radius: 3px;
                padding: 0 3px;
                cursor: help;
                transition: background-color 0.15s ease;
            }
            .tm-math-fixed:hover {
                background-color: rgba(16, 185, 129, 0.25);
            }

            /* Amber tint when the script also had to rescue an "inverted" English or <em> block */
            .tm-math-fixed.tm-math-inverted {
                background-color: rgba(245, 158, 11, 0.14);
                border-bottom: 1px dashed rgba(245, 158, 11, 0.75);
            }
            .tm-math-fixed.tm-math-inverted:hover {
                background-color: rgba(245, 158, 11, 0.28);
            }

            /* Instant hover tooltip showing the raw original string */
            .tm-math-fixed::after {
                content: attr(data-original);
                position: absolute;
                bottom: calc(100% + 6px);
                left: 50%;
                transform: translateX(-50%);
                background: #18181b;
                color: #f4f4f5;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 12px;
                line-height: 1.4;
                padding: 4px 8px;
                border-radius: 5px;
                border: 1px solid rgba(255, 255, 255, 0.15);
                white-space: pre;
                max-width: 420px;
                overflow: hidden;
                text-overflow: ellipsis;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                pointer-events: none;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.12s ease;
                z-index: 9999;
            }
            .tm-math-fixed:hover::after {
                opacity: 1;
                visibility: visible;
            }
        `;
        document.head.appendChild(style);
    }

    // Matches $...$ that has leading and/or trailing spaces inside the delimiters
    const BROKEN_MATH_REGEX = /\$\s+([^$\n]+?)\s+\$|\$\s+([^$\n]+?)\$\vert{}\$([^$\n]+?)\s+\$/g;

    function fixAndRenderMath(root = document.body) {
        const blocks = root.querySelectorAll('[data-tts-block="true"], p, li');

        blocks.forEach(block => {
            if (!block.textContent.includes('$')) return;

            let hadInvertedRescue = false;

            // Step 1a: Unwrap "inverted" KaTeX spans where English text got swallowed between `$.` and `($`
            block.querySelectorAll('.katex').forEach(katexEl => {
                if (katexEl.closest('.tm-math-fixed')) return;

                const prev = katexEl.previousSibling;
                const next = katexEl.nextSibling;
                const annotation = katexEl.querySelector('annotation[encoding="application/x-tex"]');

                if (
                    annotation &&
                    prev && prev.nodeType === Node.TEXT_NODE && /\$\s*[^$]+$/.test(prev.nodeValue) &&
                    next && next.nodeType === Node.TEXT_NODE && /^[^$]+\s*\$/.test(next.nodeValue)
                ) {
                    katexEl.replaceWith(document.createTextNode('$' + annotation.textContent + '$'));
                    block.normalize();
                    hadInvertedRescue = true;
                }
            });

            // Step 1b: Unwrap <em> tags where Markdown accidentally italicized LaTeX asterisks (e.g. T^* ... T^*)
            block.querySelectorAll('em').forEach(emEl => {
                if (emEl.closest('.katex, .tm-math-fixed')) return;

                const prevText = emEl.previousSibling?.nodeType === Node.TEXT_NODE ? emEl.previousSibling.nodeValue : '';
                const emText = emEl.textContent;

                const range = document.createRange();
                range.setStart(block, 0);
                range.setEndBefore(emEl);
                const dollarsBefore = (range.toString().match(/\$/g) || []).length;

                const isBrokenMathEm =
                    /[\^_\\]$/.test(prevText) ||
                    /[\^_\\]$/.test(emText) ||
                    emText.includes('$') ||
                    emText.includes('\\') ||
                    dollarsBefore % 2 === 1;

                if (isBrokenMathEm) {
                    emEl.replaceWith(document.createTextNode('*' + emText + '*'));
                    block.normalize();
                    hadInvertedRescue = true;
                }
            });

            // Step 2: Walk raw text nodes (ignoring already-rendered KaTeX, links, and footnote supers)
            const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
                acceptNode(node) {
                    if (node.parentElement.closest('.katex, .tm-math-fixed, code, pre, script, style, sup')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            });

            const textNodes = [];
            while (walker.nextNode()) textNodes.push(walker.currentNode);

            // Step 3: Replace each broken $...$ match with a highlighted span + rendered KaTeX
            textNodes.forEach(node => {
                const text = node.nodeValue;
                BROKEN_MATH_REGEX.lastIndex = 0;
                if (!BROKEN_MATH_REGEX.test(text)) return;

                BROKEN_MATH_REGEX.lastIndex = 0;
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;
                let match;

                while ((match = BROKEN_MATH_REGEX.exec(text)) !== null) {
                    if (match.index > lastIndex) {
                        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                    }

                    const rawMatch = match[0];
                    const cleanTex = (match[1] || match[2] || match[3]).trim();

                    const wrapper = document.createElement('span');
                    wrapper.className = 'tm-math-fixed' + (hadInvertedRescue ? ' tm-math-inverted' : '');
                    const label = hadInvertedRescue ? `Rescued: ${rawMatch}` : `Original: ${rawMatch}`;
                    wrapper.setAttribute('data-original', label);
                    wrapper.setAttribute('title', label);

                    try {
                        katex.render(cleanTex, wrapper, {
                            displayMode: false,
                            throwOnError: false
                        });
                    } catch (err) {
                        wrapper.textContent = rawMatch;
                    }

                    fragment.appendChild(wrapper);
                    lastIndex = BROKEN_MATH_REGEX.lastIndex;
                }

                if (lastIndex < text.length) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
                }

                node.replaceWith(fragment);
            });
        });
    }

    fixAndRenderMath();

    const observer = new MutationObserver(() => fixAndRenderMath());
    observer.observe(document.body, { childList: true, subtree: true });
})();
