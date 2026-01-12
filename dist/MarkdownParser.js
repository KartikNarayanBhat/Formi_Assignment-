"use strict";
const blogpostMarkdown = `# control

*humans should focus on bigger problems*

## Setup

\`\`\`bash
git clone git@github.com:anysphere/control
\`\`\`

\`\`\`bash
./init.sh
\`\`\`

## Folder structure

**The most important folders are:**

1. \`vscode\`: this is our fork of vscode, as a submodule.
2. \`milvus\`: this is where our Rust server code lives.
3. \`schema\`: this is our Protobuf definitions for communication between the client and the server.

[... rest of markdown ...]`;
let currentContainer = null;
// FIXED GLOBAL STATE
let parserState = 'text';
let backtickBuffer = '';
let currentElement = null;
// Do not edit this method
function runStream() {
    currentContainer = document.getElementById('markdownContainer');
    const tokens = [];
    let remainingMarkdown = blogpostMarkdown;
    while (remainingMarkdown.length > 0) {
        const tokenLength = Math.floor(Math.random() * 18) + 2;
        const token = remainingMarkdown.slice(0, tokenLength);
        tokens.push(token);
        remainingMarkdown = remainingMarkdown.slice(tokenLength);
    }
    const toCancel = setInterval(() => {
        const token = tokens.shift();
        if (token) {
            addToken(token);
        }
        else {
            clearInterval(toCancel);
        }
    }, 20);
}
function addToken(token) {
    if (!currentContainer)
        return;
    for (let i = 0; i < token.length; i++) {
        const char = token[i];
        if (char === '`') {
            backtickBuffer += '`';
        }
        else {
            // Process buffered backticks BEFORE appending char
            if (backtickBuffer.length > 0) {
                handleBackticks();
                backtickBuffer = ''; // Always clear buffer
            }
            appendChar(char);
        }
    }
    // Handle trailing backticks
    if (backtickBuffer.length > 0) {
        handleBackticks();
        backtickBuffer = '';
    }
}
function handleBackticks() {
    const count = backtickBuffer.length;
    if (count === 1) {
        // Toggle inline code
        if (parserState === 'inlineCode') {
            parserState = 'text';
            currentElement = null;
        }
        else {
            parserState = 'inlineCode';
            createElement('code', 'inline-code');
        }
    }
    else if (count >= 3) {
        // Toggle code block
        if (parserState === 'codeBlock') {
            parserState = 'text';
            currentElement = null;
        }
        else {
            parserState = 'codeBlock';
            createElement('pre', 'code-block');
        }
    }
    backtickBuffer = ''; // Always reset
}
function appendChar(char) {
    if (!currentElement || parserState === 'text') {
        createElement('span', 'text');
    }
    currentElement.textContent += char;
}
function createElement(tag, className) {
    const el = document.createElement(tag);
    el.className = className;
    if (className === 'inline-code') {
        el.style.backgroundColor = '#e3f2fd';
        el.style.padding = '2px 6px';
        el.style.borderRadius = '4px';
        el.style.fontFamily = 'monospace';
        el.style.color = '#1976d2';
    }
    else if (className === 'code-block') {
        el.style.backgroundColor = '#f8f9fa';
        el.style.padding = '12px';
        el.style.borderLeft = '4px solid #2196f3';
        el.style.margin = '8px 0';
        el.style.fontFamily = 'monospace';
        el.style.whiteSpace = 'pre-wrap';
        el.style.borderRadius = '4px';
    }
    currentContainer.appendChild(el);
    currentElement = el;
    return el;
}
//# sourceMappingURL=MarkdownParser.js.map