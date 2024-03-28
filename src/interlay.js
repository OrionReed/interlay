function handleMessage(request, sender) {
  if (request.action === "enableInterlay") {
    window.postMessage({ action: 'enableInterlay' }, '*');
  }
}

browser.runtime.onMessage.addListener(handleMessage);
