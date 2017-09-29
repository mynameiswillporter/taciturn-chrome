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

function createAlert(text) {
  new Notification('Warning', {
      icon: '../img/warning.png',
      body: text
  });
}

function ruleSessionInQueryString(pageData, alertFunction) {
  // Get the query string part of the url
  var queryString = $('<a>', { href:pageData.url } )[0].search;

  // Check for sessions in the url
  if (containsSessionSubstring(queryString)) {
    alertFunction('Session string found in query string! (' + pageUrl + ') ');
  }
}

function ruleInsecureSessionCookie(pageData, alertFunction) {
  // Analyze the cookies on this page
  for (var cookie in pageData.cookies) {
      var cookieName = pageData.cookies[cookie].name;

      // Send a notification if there is a possible HttpOnly session cookie
      if (containsSessionSubstring(cookieName) && !pageData.cookies[cookie].httpOnly) {
          alertFunction('Insecure session cookie found! (' + pageData.cookies[cookie].domain + '/' + pageData.cookies[cookie].name + ')');
      }
  }
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

              var pageUrl = sender.tab.url;
              var hostname = getHostname(pageUrl);

              if (!ignoredDomains.includes(hostname)) {
                    chrome.cookies.getAll({'url': pageUrl}, function (cookies) {

                      // Create the data we will send to rules
                      pageData = {};
                      pageData.url = pageUrl;
                      pageData.cookies = cookies;

                      // Run the rules
                      ruleSessionInQueryString(pageData, createAlert);
                      ruleInsecureSessionCookie(pageData, createAlert);
                    });
              } else {
                console.log("Domain is in ignored domains list.");
              }
            } else {
                // It appears as though this occurs when the webpage accessed is the extension
                console.log("Not processing this page because sender.tab did not exist");
            }
          }
          sendResponse({farewell: ''});
        }
    );

    // Allow the toggling of the extension
    chrome.browserAction.onClicked.addListener(function(tab) {
      chrome.storage.sync.get('state', function(data) {
        if (data.state === 'on') {
          chrome.storage.sync.set({state: 'off'});
          chrome.browserAction.setIcon({path: "../img/icon-off.png"});
        } else {
          chrome.storage.sync.set({state: 'on'});
          chrome.browserAction.setIcon({path: "../img/icon-on.png"});
        }
      });
    });

    // Initial loading determination
    chrome.storage.sync.get('state', function(data) {
      if (data.state === 'on') {
        chrome.browserAction.setIcon({path: "../img/icon-on.png"});
      } else {
        chrome.browserAction.setIcon({path: "../img/icon-off.png"});
      }
    });
});
