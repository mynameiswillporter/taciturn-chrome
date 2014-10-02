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

<<<<<<< HEAD
    // This can change the icon
    // chrome.browserAction.setIcon({path: "./icon2.jpg"});

    chrome.experimental.cookies.getAll({}, function(cookies) {
        $("#content").append(cookies);
    });    
=======
/*
	
	chrome.runtime.onMessage.addListener(
		chrome.cookies.getAll({}, function (cookies) {
			for (cookie in cookies)		
			{
				var name = cookies[cookie].name;
				if (name.indexOf('session') >= 0 && !cookies[cookie].httpOnly)
				{
					//make a call to the background
					var data = [2];
					data[0] = name;
					data[1] = cookies[cookie].domain;
					sendResponse({farewell: data});
				}
			}
		}); 
>>>>>>> 7867c93aa39cbb2ed3f901bd9361db114edaf7b6
});

*/
