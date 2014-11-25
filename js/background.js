
function containsSessionSubstring(testString) {
    
    // These are the strings used to identify possible session cookies
    //var sessionSubstrings = [ "session", "sid", "PHPSESSID", "csrf" ];
    var sessionSubstrings = ["sess", "sid", "csrf"];

    // Create a case insensitive regular expression from the session substrings
    var sessionRegExp = new RegExp(sessionSubstrings.join("|"), "i");

    return sessionRegExp.test(testString);
    
}


$(document).ready(function() {
    
     // This block checks resposne headers
     chrome.webRequest.onHeadersReceived.addListener(function(details) {
        
        var responseHeaders = details.responseHeaders;

        // If this is the main frame, check the X-Frame-Options header
        if (details.type == "main_frame") {

            var containsXFrameOptions = false;
            responseHeaders.forEach(function(header) {
                if (header.name == "X-Frame-Options") {
                    containsXFrameOptions = true;
                }
            });

            if (!containsXFrameOptions) {
                new Notification('Warning', {
                    icon: '../img/popup.png',
                    body: 'Page did not set X-Frame-Options header! (' + details.url + ') '
                });
            }
        }

    }, {urls: ["*://*/*"]}, ["responseHeaders"]);

    // This listens for messages from the foreground script
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {

            // Get the html from the message, this is currentlythe only contents of the message
            var pageHtml = request.html;
		
            // Make sure that the web page is in the browser and not in the extension
            if (sender.tab) {

                // get the url of the page
                var pageUrl = sender.tab.url;	
                console.log("Page URL: " + pageUrl);

                // Get the query string part of the url
                var queryString = $('<a>', { href:pageUrl } )[0].search;
                        
                // Check for sessions in the url
                if (containsSessionSubstring(queryString)) {
                    new Notification('Warning', {
                        icon: '../img/popup.png',
                        body: 'Session string found in query string! (' + pageUrl + ') '
                    });
                }

                // Look through all of the cookies associated with this page
                chrome.cookies.getAll({'url': pageUrl}, function (cookies) {
    				
                    // Analyze the cookies on this page
                    for (cookie in cookies) {
                        var cookieName = cookies[cookie].name;
                        
                        // Send a notification if there is a possible HttpOnly session cookie
                        if (containsSessionSubstring(cookieName) && !cookies[cookie].httpOnly) {
                            new Notification('Warning', {
                                icon: '../img/popup.png',
                                body: 'Insecure session cookie found! (' + cookies[cookie].domain + '/' + cookies[cookie].name + ') '
                            });
                        }
                    }
                });

                // This is wrong because its not checking the dom of the webpage.
                // Check hidden elements for session stuff.

                $(pageHtml).find('input:hidden').each(function() {
                    var fieldName = $(this).attr('name');
                    var fieldTitle = $(this).attr('title');
                    
                    if (containsSessionSubstring(fieldName) || containsSessionSubstring(fieldTitle)) {
                        new Notification('Warning', {
                            icon: '../img/popup.png',
                            body: 'Session found in hidden field! (' + fieldName  + ') '
                        });
                    }

                });
                
                sendResponse({farewell: ''});
            } else {

                // It appears as though this occurs when the webpage accessed is the extension
                console.log("Not processing this page because sender.tab did not exist");
            }
        }
    );
});

