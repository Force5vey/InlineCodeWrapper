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

    /* ── Plain‐text controls unchanged ───────────────────────────── */
    if (activeEl && (activeEl.tagName === 'TEXTAREA' ||
        (activeEl.tagName === 'INPUT' && activeEl.type === 'text'))) {
        const [s, e] = [activeEl.selectionStart, activeEl.selectionEnd];
        activeEl.setRangeText('`' + activeEl.value.slice(s, e) + '`', s, e, 'end');
        activeEl.dispatchEvent(new Event('input', { bubbles: true }));
        return;
    }

    /* ── Rich‑text branch ────────────────────────────────────────── */
    const raw = sel.toString();
    const leadWS = raw.match(/^\s*/)[0];   // keep leading/trailing spaces *outside* the tag
    const trailWS = raw.match(/\s*$/)[0];
    const core = raw.trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;');

    const html = leadWS +
        `<em style="font-family:'Courier New', monospace;font-size:16px;">${core}</em>` +
        trailWS;

    document.execCommand('insertHTML', false, html);

    // Tell the editor a change happened
    const root = sel.anchorNode && sel.anchorNode.parentNode;
    if (root) root.dispatchEvent(new Event('input', { bubbles: true }));
}


