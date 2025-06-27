chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "wrap-as-code",
        title: "Wrap selection as code",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== "wrap-as-code") return;
    chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: wrapSelection
    });
});

chrome.action.onClicked.addListener(tab => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: wrapSelection
    }).catch(err => console.error('Wrapper injection failed:', err));
});

function wrapSelection() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;

    const activeEl = document.activeElement;

    // Plain <textarea>/<input> branch unchanged …
    if (activeEl && (activeEl.tagName === 'TEXTAREA' ||
        (activeEl.tagName === 'INPUT' && activeEl.type === 'text'))) {
        const [start, end] = [activeEl.selectionStart, activeEl.selectionEnd];
        activeEl.setRangeText('`' + activeEl.value.slice(start, end) + '`', start, end, 'end');
        activeEl.dispatchEvent(new Event('input', { bubbles: true }));
        return;
    }

    try {
        const range = sel.getRangeAt(0);
        const code = document.createElement('code');
        code.textContent = sel.toString();

        range.deleteContents();
        range.insertNode(code);

        // move caret after the new node
        range.setStartAfter(code); range.collapse(true);
        sel.removeAllRanges(); sel.addRange(range);

        code.parentNode.dispatchEvent(new Event('input', { bubbles: true }));
    } catch (e) {
        console.error('Inline-code wrapper error:', e);
    }
}

