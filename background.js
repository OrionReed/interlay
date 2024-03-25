browser.action.onClicked.addListener(tab => {
  console.log("CLICKED");
  // Find all tabs that match your specific conditions
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Send a message to the active tab
    browser.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (response) {
      console.log(response);
    });
  });
})
