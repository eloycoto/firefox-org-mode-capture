function saveTabInfo(info, tab) {
  const tabInfo = {
    url: tab.url,
    title: tab.title,
    timestamp: new Date().toISOString(),
    source: info ? 'context-menu' : 'browser-action'
  };

      let formattedString = `* ${tabInfo.title}
:PROPERTIES:
:CREATED: ${new Date().toISOString()}
:END:

[[${tabInfo.url}][${tabInfo.title}]]
`;

  browser.tabs.executeScript(tab.id, {
    code: `(() => {
      const selection = window.getSelection();
      if (!selection.rangeCount) return null; // No selection made

      // Map each range in the selection to a JSON-serializable object
      const ranges = [];
      for (let i = 0; i < selection.rangeCount; i++) {
        const range = selection.getRangeAt(i);
        ranges.push({
          text: range.toString(), // Extract the text content
          startContainer: range.startContainer.nodeName, // Start node type
          startOffset: range.startOffset, // Start offset within the start node
          endContainer: range.endContainer.nodeName, // End node type
          endOffset: range.endOffset // End offset within the end node
        });
      }

      return ranges;
    })();`
  }).then(function(selectionRanges) {
    if (selectionRanges && selectionRanges[0]) {
      selectionRanges[0].forEach(selection => {
        if (selection.text != "") {
          formattedString += `
  #+BEGIN_QUOTE
    ${selection.text.trim()}
  #+END_QUOTE
`;
        }
      });

    }
    navigator.clipboard.writeText(formattedString).then(() => {
      console.log("Formatted string copied to clipboard:", formattedString);
    }).catch(err => {
      console.error("Failed to copy to clipboard:", err);
    });

  }).catch(function(error) {
    console.error("Error fetching selection:", error);
  });
}

// Function to copy text to clipboard using Clipboard API
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log("Copied to clipboard!");
    })
    .catch(err => {
      console.error("Unable to copy text to clipboard", err);
    });
}

// Function to create context menu
function createContextMenu() {
  browser.contextMenus.create({
    id: "save-selection",
    title: "Save Selection to Tab Info",
    contexts: ["selection", "page"]
  });
}

// Listener for context menu click
browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "save-selection") {
    saveTabInfo(info, tab);
  }
});

createContextMenu();
