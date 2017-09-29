// A Global variable to store ignored Domains.
// Taciturn-Chrome will not create alerts for
// domains in this list.  This list can be updated by
// message passing from the options script.
var ignoredDomains = [];

// Helper function to get the hostname from a URL
function getHostname(url) {
  var parser = document.createElement('a');
  parser.href = url;
  return parser.hostname;
}

function containsSessionSubstring(testString) {
    // These are the strings used to identify possible session cookies
    //var sessionSubstrings = [ "session", "sid", "PHPSESSID", "csrf" ];
    var sessionSubstrings = ["sess", "sid", "csrf"];

    // Create a case insensitive regular expression from the session substrings
    var sessionRegExp = new RegExp(sessionSubstrings.join("|"), "i");
    return sessionRegExp.test(testString);
}

// Add a listener for ignored Domain Updates
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    switch (request.greeting) {
    case "updateIgnoredDomains":
      ignoredDomains = request.ignoredDomains;
      sendResponse({farewell: "goodbye"});
      break;
    default:
      sendResponse({}); // snub them.
    }
  }
);

$(document).ready(function() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          if (request.greeting === "inspectPage") {

            // Make sure that the web page is in the browser and not in the extension
            if (sender.tab) {
              // get the url of the page
              var pageUrl = sender.tab.url;
              var hostname = getHostname(pageUrl);

              if (!ignoredDomains.includes(hostname)) {
                    // Get the query string part of the url
                    var queryString = $('<a>', { href:pageUrl } )[0].search;

                    // Check for sessions in the url
                    if (containsSessionSubstring(queryString)) {
                        new Notification('Warning: ', {
                            icon: '../img/popup.png',
                            body: 'Session string found in query string! (' + pageUrl + ') '
                        });
                    }

                    // Look through all of the cookies associated with this page
                    chrome.cookies.getAll({'url': pageUrl}, function (cookies) {

                        // Analyze the cookies on this page
                        for (var cookie in cookies) {
                            var cookieName = cookies[cookie].name;

                            // Send a notification if there is a possible HttpOnly session cookie
                            if (containsSessionSubstring(cookieName) && !cookies[cookie].httpOnly) {
                                new Notification('Warning: ', {
                                    icon: '../img/popup.png',
                                    body: 'Insecure session cookie found! (' + cookies[cookie].domain + '/' + cookies[cookie].name + ') '
                                });
                            }
                        }
                    });

                    // This is wrong because its not checking the dom of the webpage.
                    // Check hidden elements for session stuff.
                    $('input:hidden').each(function() {

                        var fieldName = $(this).attr('name');
                        if (containsSessionSubstring(fieldName)) {
                            new Notification('Warning: ', {
                                icon: '../img/popup.png',
                                body: 'Session found in hidden field! (' + fieldName  + ') '
                            });
                        }
                    });
                    sendResponse({farewell: ''});
                }

            } else {
                // It appears as though this occurs when the webpage accessed is the extension
                console.log("Not processing this page because sender.tab did not exist");
            }
          }
        }
    );
});
