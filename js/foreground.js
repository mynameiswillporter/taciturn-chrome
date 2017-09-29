$(document).ready(function() {

    // This is executed every time a page loads in the browser.
    chrome.runtime.sendMessage({greeting: "inspectPage"}, function(response) {
        //do nothing, we don't care what the background process sends back to us
    });
});
