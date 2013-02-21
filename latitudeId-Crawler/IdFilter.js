var HTTPRequest = require("./HTTPRequest.js");

getIDsFromURL = function(url, callback, onEnd){
	console.log("Searching for IDs from URL: "+url);
	HTTPRequest.curl(url, function(body){
		getIDsFromHTML(body,callback, onEnd);
	});
}

getIDsFromHTML = function(htmlString, callback, onEnd){
	var regex = /google\.com\/latitude\/apps\/badge\/api\?user=([^&]*)&/g //extracting IDs via regex
	var result = regex.exec(htmlString);
	while (result != null) {
		if(result[1] != null){
		console.log("Found ID:\n"+result[1]);
		callback(""+result[1]);
		}
	    result = regex.exec(htmlString);
	}
	onEnd();
}

exports.getIDsFromHTML = getIDsFromHTML;
exports.getIDsFromURL = getIDsFromURL;