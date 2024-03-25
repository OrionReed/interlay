browser.action.onClicked.addListener(tab => {
  console.log("CLICKED");
  if (browser.scripting?.executeScript) {
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['index.js']
    }).then(() => {
      console.log("Script executed successfully");
    }).catch(error => {
      console.error("Error executing script: ", error);
    });
  }

  // Find all tabs that match your specific conditions
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Send a message to the active tab
    browser.tabs.sendMessage(tabs[0].id, { greeting: "hello" });
  });
})
