//@ts-nocheck
browser.action.onClicked.addListener((tab) => {
	browser.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => window.postMessage({ action: "enableInterlay" }, "*"),
	});
});
