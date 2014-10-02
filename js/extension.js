$(document).ready(function() {

    // This is executed every time a page loads in the browser.
	chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
		//do nothing
	});	
});
