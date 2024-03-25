function handleMessage(request, sender) {
  if (request.greeting === "hello") {
    console.log('REVIECEDDDD');
  }
}

browser.runtime.onMessage.addListener(handleMessage);