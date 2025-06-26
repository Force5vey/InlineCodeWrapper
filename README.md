# Inline Code Wrapper Extension

This is a simple browser extension for Chrome, Edge, and other Chromium-based browsers. Its purpose is to wrap selected text in `<code>` tags or backticks, which is useful for formatting code snippets in online editors, such as the LEO classroom environment at UMGC.

## How to Use

You can activate the wrapper in three ways:

1.  **Keyboard Shortcut:** Select text and press `Ctrl+Shift+Z`.
2.  **Right-Click Menu:** Select text, right-click, and choose "Wrap selection as code".
3.  **Toolbar Icon:** Select text and click the extension's icon in your browser's toolbar.

The extension behaves differently based on where you are typing:

-   In rich-text editors (like the main post editor in a forum), it wraps the selection in HTML `<code>` tags.
-   In plain-text fields (`<textarea>` or `<input>`), it wraps the selection in backticks (`` ` ``).

## Installation in Microsoft Edge

This extension is not on the official store. You must install it manually in "developer mode". This process is often called "sideloading".

1.  Download the extension files and place them in a permanent folder on your computer (e.g., `C:\Users\YourUser\Documents\Extensions\CodeWrapper`). If you move or delete this folder, the extension will stop working.
2.  Open Microsoft Edge and navigate to the Extensions page by typing `edge://extensions/` in the address bar and pressing Enter.
3.  In the bottom-left corner, enable the **Developer mode** toggle switch.
4.  New buttons will appear. Click the **Load unpacked** button.
5.  A file selection dialog will open. Navigate to and select the folder where you saved the extension files (e.g., the `CodeWrapper` folder). Do not select the individual files, but the folder that contains them.
6.  The extension is now installed and active.

## Installation in Google Chrome

This extension is fully compatible with Google Chrome. The installation process requires enabling developer mode to "sideload" the extension, which is very similar to the procedure for Microsoft Edge.

1.  Download the extension files and place them in a permanent folder on your computer (e.g., `C:\Users\YourUser\Documents\Extensions\CodeWrapper`). The extension will cease to function if this folder is moved or deleted.
2.  Open Google Chrome and navigate to the Extensions page by typing `chrome://extensions/` in the address bar and pressing Enter.
3.  In the top-right corner of the page, enable the **Developer mode** toggle switch.
4.  A new set of buttons will appear on the top-left. Click the **Load unpacked** button.
5.  In the file selection dialog that opens, navigate to and select the folder containing the extension's source files (e.g., the `CodeWrapper` folder). You must select the parent folder, not the individual files within it.
6.  The extension will now appear in your list of installed extensions and is ready to use.

## Understanding the Files

An extension is made of a few key files. Understanding their purpose is necessary for customization.

-   `manifest.json`: This is the configuration file. It's like an ID card for the extension. It tells the browser the extension's name, version, what permissions it needs to run, and where its other files are.
-   `bg.js`: This is a JavaScript file that acts as the "brain" of the extension. It runs in the background, listening for events like clicks or keyboard shortcuts, and contains the logic for what to do when those events happen.

## Customization

You can modify the extension's files with any plain text editor (like Notepad, VS Code, or Sublime Text). After saving any changes, you must reload the extension by going to `edge://extensions/` and clicking the "Reload" icon on the extension's card.

### 1. Restrict to a Specific Website

For security, it is better to limit where the extension can run instead of allowing it on all websites. The `host_permissions` key in `manifest.json` controls this.

To limit the extension to only run on the UMGC learning environment:

1.  Open `manifest.json`.
2.  Find this line:
    ```json
    "host_permissions": ["<all_urls>"],
    ```
3.  Change it to:
    ```json
    "host_permissions": ["https://learn.umgc.edu/*"],
    ```
4.  The `/*` at the end is a wildcard, meaning it will match any page on the `learn.umgc.edu` domain. Save the file and reload the extension.

### 2. Change the Right-Click Menu Text

The text that appears in the right-click context menu is defined in the `bg.js` file.

1.  Open `bg.js`.
2.  Find this block of code near the top:
    ```javascript
    chrome.contextMenus.create({
      id: "wrap-as-code",
      title: "Wrap selection as code",
      contexts: ["selection"],
    });
    ```
3.  Change the value of the `title` property to your desired text:
    ```javascript
    title: "Format as Code Snippet",
    ```
4.  Save the file and reload the extension.

### 3. Change the Keyboard Shortcut

The default keyboard shortcut is defined in `manifest.json`.

1.  Open `manifest.json`.
2.  Find the `commands` section:
    ```json
    "commands": {
      "_execute_action": {
        "suggested_key": { "default": "Ctrl+Shift+Z" },
        "description": "Wrap selection in <code>"
      }
    }
    ```
3.  Change the `default` value to a different key combination, such as `Ctrl+Shift+C`:
    ```json
    "suggested_key": { "default": "Ctrl+Shift+C" },
    ```
4.  Save the file and reload the extension.

**Note:** You can also manage shortcuts for all your extensions directly in Edge by navigating to `edge://extensions/shortcuts`. Changing it here does not require editing any files but will not be the default if you install the extension elsewhere.