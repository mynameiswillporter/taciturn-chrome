$(document).ready(function() {
	console.log("loaded");
	chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
		//do nothing
	});	
});