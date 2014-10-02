$(document).ready(function() {

    // These are the strings used to identify possible session cookies
    //var sessionSubstrings = [ "session", "sid", "PHPSESSID", "csrf" ];
    var sessionSubstrings = ["sess", "sid", "csrf"];

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
		
            // Make sure that the web page is in the browser and not in the extension
            if (sender.tab) {
	
			    chrome.cookies.getAll({'url': sender.tab.url}, function (cookies) {
				    console.log(cookies);
    				for (cookie in cookies)
	    			{
                        var cookieName = cookies[cookie].name;
                        console.log(cookieName); 
                        if (new RegExp(sessionSubstrings.join("|"),"i").test(cookieName) && !cookies[cookie].httpOnly) 
					    {
						    new Notification('Warning', {
							    icon: 'img/popup.png',
							    body: 'Insecure session cookie found! (' + cookies[cookie].domain + '/' + cookies[cookie].name + ') '
						    });
					    }
				    }
			    });
		        sendResponse({farewell: ''});
	        } else {

                // It appears as though this occurs when the webpage accessed is the extension
                console.log("Not processing this page because sender.tab did not exist");
            }
    });
});

