var search = require("./Search.js");
var idFilter = require("./IdFilter.js");
var async = require('async');

var fs = require('fs');

var collectedLinks = ['http://www.bing.com/search?q=%22latitude.google.com%2Flatitude%2Fapps%2Fbadge%2Fapi%3Fuser%3D%22'];
//var collectedIDs = [];

function crawlUrl(url){
		search.crawlForLinks(url, function(result){
		collectedLinks.push(result);
		idFilter.getIDsFromURL(result, function(id){
			collectedIDs.push(id);
			str = "http://latitude.google.com/latitude/apps/badge/api?user="+id+"&type=iframe\n";
			fs.open("./IDs.txt", 'a', 666, function( e, id ) {
			  fs.write( id, str, null, 'utf8', function(){
			    fs.close(id, function(){
			      console.log('file closed');
			    });
			  });
			});
			//fs.appendFile("./IDs.txt", , 'utf-8', function(err) {
    		//	if(err) {
        	//	console.log(err);
    		//	} }); 
		}, function(){
			//itemsProcessed++;
		});
	});
}

function crawl(startUrls){
	async.map(startUrls, crawlUrl, function(err, results){
		console.log("Anzahl IDs gesammelt: "+results.length);
	});
}

crawl(collectedLinks);