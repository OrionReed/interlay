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

browser.webRequest.onHeadersReceived.addListener(
	(details) => {
		for (let i = 0; i < details.responseHeaders.length; i++) {
			if (
				["content-security-policy", "x-content-security-policy"].includes(
					details.responseHeaders[i].name.toLowerCase(),
				)
			) {
				details.responseHeaders.splice(i, 1); // Remove CSP header
				break; // Assuming only one CSP header, break after finding it
			}
		}
		return { responseHeaders: details.responseHeaders };
	},
	{ urls: ["<all_urls>"] }, // Use specific URL patterns to limit scope
	["blocking", "responseHeaders"],
);
