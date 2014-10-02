$(document).ready(function() {

    // These are the strings used to identify possible session cookies
    var sessionSubstrings = [ "session", "sid" ];

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			console.log(sender.tab ?
				"from a content script:" + sender.tab.url :
				"from the extension");
			
			chrome.cookies.getAll({'url': sender.tab.url}, function (cookies) {
				console.log(cookies);
				for (cookie in cookies)
				{
                    var cookieName = cookies[cookie].name;
                    console.log(cookieName); 
                    if (new RegExp(sessionSubstrings.join("|")).test(cookieName) && !cookies[cookie].httpOnly) 
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

