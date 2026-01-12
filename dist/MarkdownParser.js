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


Each of the above folders should contain fairly comprehensive README files; please read them. If something is missing, or not working, please add it to the README!


Some less important folders:


1. \`release\`: this is a collection of scripts and guides for releasing various things.
2. \`infra\`: infrastructure definitions for the on-prem deployment.
3. \`third_party\`: where we keep our vendored third party dependencies.


## Miscellaneous things that may or may not be useful


##### Where to find rust-proto definitions


They are in a file called \`aiserver.v1.rs\`. It might not be clear where that file is. Run \`rg --files --no-ignore bazel-out | rg aiserver.v1.rs\` to find the file.


## Releasing


Within \`vscode/\`:


- Bump the version
- Then:


\`\`\`
git checkout build-todesktop
git merge main
git push origin build-todesktop
\`\`\`


- Wait for 14 minutes for gulp and ~30 minutes for todesktop
- Go to todesktop.com, test the build locally and hit release
`;
let currentContainer = null;
// GLOBAL STATE (Add these)
let parserState = 'text';
let backtickBuffer = '';
let currentElement = null;
// Do not edit this method
function runStream() {
    currentContainer = document.getElementById('markdownContainer');
    // this randomly split the markdown into tokens between 2 and 20 characters long
    // simulates the behavior of an ml model thats giving you weirdly chunked tokens
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
// MAIN PARSING LOGIC - REPLACE THIS ENTIRE FUNCTION
function addToken(token) {
    if (!currentContainer)
        return;
    for (let i = 0; i < token.length; i++) {
        const char = token[i];
        if (char === '`') {
            backtickBuffer += '`';
        }
        else {
            if (backtickBuffer.length > 0) {
                handleBackticks();
            }
            appendChar(char);
        }
    }
    if (backtickBuffer.length > 0) {
        handleBackticks();
    }
}
// HANDLE BACKTICK TRANSITIONS
function handleBackticks() {
    const count = backtickBuffer.length;
    backtickBuffer = '';
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
}
// APPEND SINGLE CHARACTER
function appendChar(char) {
    if (!currentElement) {
        createElement('span', 'text');
    }
    currentElement.textContent += char;
}
// CREATE STYLED HTML ELEMENTS
function createElement(tag, className) {
    const el = document.createElement(tag);
    el.className = className;
    // INSTANT VISUAL STYLING
    if (className === 'inline-code') {
        el.style.backgroundColor = '#e3f2fd';
        el.style.padding = '2px 6px';
        el.style.borderRadius = '4px';
        el.style.fontFamily = 'monospace';
        el.style.color = '#1976d2';
        el.style.fontSize = '14px';
    }
    else if (className === 'code-block') {
        el.style.backgroundColor = '#f8f9fa';
        el.style.padding = '12px';
        el.style.borderLeft = '4px solid #2196f3';
        el.style.margin = '8px 0';
        el.style.fontFamily = 'monospace';
        el.style.whiteSpace = 'pre-wrap';
        el.style.borderRadius = '4px';
        el.style.fontSize = '14px';
        el.style.lineHeight = '1.5';
    }
    currentContainer.appendChild(el);
    currentElement = el;
    return el;
}
//# sourceMappingURL=MarkdownParser.js.map