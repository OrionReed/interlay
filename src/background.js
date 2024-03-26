browser.action.onClicked.addListener(tab => {
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { action: "toggleInterlayCanvas" });
  });
})