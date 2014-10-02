$(document).ready(function() {
	chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
		//do nothing
	});	
});
