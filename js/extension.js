$(document).ready(function() {
	console.log("loaded");
<<<<<<< HEAD

    // This can change the icon
    // chrome.browserAction.setIcon({path: "./icon2.jpg"});

	chrome.cookies.getAll({}, function (cookies) {
		for (cookie in cookies)		
		{
			var name = cookies[cookie].name;
			if (name.indexOf('session') >= 0 && !cookies[cookie].httpOnly)
			{
				console.log(cookies[cookie].domain + ":" + name);
			}
			
		}
		console.log(cookies);
		$("#content").append(cookies);
	});    
});
=======
	chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
		//do nothing
	});	
});
>>>>>>> 7867c93aa39cbb2ed3f901bd9361db114edaf7b6
