// Everytime a page loads in the browser
$(document).ready(function() {
  chrome.storage.sync.get('state', function(data) {
    if (data.state === 'on') {
      chrome.runtime.sendMessage({greeting: "inspectPage"}, function(response) {});
    }
  });
});
