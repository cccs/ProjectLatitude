var jsdom = require("jsdom"); //loading jsdom (see: https://github.com/tmpvar/jsdom)
var fs = require("fs");
var jquery = fs.readFileSync("./lib/jquery.js").toString(); //loading jquery-lib for use with jsdom
var req = require("./HTTPRequest.js");

	crawlForLinks = function(query, callback){
		//e.g. query = https://www.google.de/search?q="latitude.google.com/latitude/apps/badge/api?user="		
		//e.g. query = www.bing.com/search?q="latitude.google.com%2Flatitude%2Fapps%2Fbadge%2Fapi%3Fuser%3D"

		console.log("Starting Crawler");
			req.curl(query, function(data){
			//console.log("Got data from "+query+" :\n"+data);
			console.log("Extracting Links from "+query+":\n");
			getLinksFromHTML(data, callback);
			console.log("End Extracting Links from "+query);
		});

	}

	getLinksFromHTML = function(htmlString, callback){
		jsdom.env({
		 	html: htmlString,
		 	src: [jquery],
			done: function (errors, window) {
		    var $ = window.$;
		    
		    $("a").each(function() {
		    	var href = $(this).attr("href");
		    	console.log(" -", href);
		    	callback(href);
		    });
			}
		});
	}


exports.crawlForLinks = crawlForLinks;
