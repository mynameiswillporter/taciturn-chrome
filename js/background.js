$(document).ready(function() {

    // These are the strings used to identify possible session cookies
    //var sessionSubstrings = [ "session", "sid", "PHPSESSID", "csrf" ];
    var sessionSubstrings = ["sess", "sid", "csrf"];

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
		
            // If we dont check this sometimes it stack traces
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

                // I dont fully understand sender.tab yet so putting this here just incase
                console.log("Not processing this page because sender.tab did not exist");
            }
    });
});

