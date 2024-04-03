browser.browserAction.onClicked.addListener((tab) => {
	if (!tab.id) return;
	browser.permissions.request({
		permissions: ["tabs"],
		origins: ["<all_urls>"],
	});
	browser.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => window.postMessage({ action: "enableInterlay" }, "*"),
	});
});
