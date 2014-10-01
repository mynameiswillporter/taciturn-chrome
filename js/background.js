$(document).ready(function() {

    // This can change the icon
    // chrome.browserAction.setIcon({path: "./icon2.jpg"});

    chrome.experimental.cookies.getAll({}, function(cookies) {
        $("#content").html(cookies);
    });    
});
