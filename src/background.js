import browser from "webextension-polyfill";

browser.action.onClicked.addListener((tab) => {
	if (!tab.id) return;
	browser.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => window.postMessage({ action: "enableInterlay" }, "*"),
	});
});
