$(document).ready(function() {

    // Get the entire HTML of the page, including the HTML tags.
    // Note that this will not capture the doctype
    var pageHtml = $('html')[0].outerHTML

    // This is executed every time a page loads in the browser.
    chrome.runtime.sendMessage({html: pageHtml}, function(response) {
        //do nothing, we don't care what the background process sends back to us
    });	
});
