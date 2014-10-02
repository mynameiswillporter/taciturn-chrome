$(document).ready(function() {
	//do nothing
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			console.log(sender.tab ?
				"from a content script:" + sender.tab.url :
				"from the extension");
			
			chrome.cookies.getAll({'url': sender.tab.url}, function (cookies) {
				console.log(cookies);
				for (cookie in cookies)
				{
					if (cookies[cookie].name.indexOf('session') >= 0 && !cookies[cookie].httpOnly)
					{
						new Notification('Warning', {
							icon: 'img/popup.png',
							body: 'Insecure session cookie found! (' + cookies[cookie].domain + '/' + cookies[cookie].name + ') '
						});
					}
				}
			});
		sendResponse({farewell: ''});
	});
});

