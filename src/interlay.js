function handleMessage(request, sender) {
  if (request.action === "toggleInterlayCanvas") {
    console.log('toggling');
    browser.storage.sync.get('isInterlayCanvasActive', (storage) => {
      const value =
        storage.isInterlayCanvasActive || false
      const newValue = !value;
      browser.storage.sync.set({
        isInterlayCanvasActive: newValue,
      });
      window.postMessage({ action: 'interlayCanvasToggle', detail: newValue }, '*');
    });
  }
}

browser.runtime.onMessage.addListener(handleMessage);