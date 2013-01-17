var search = require("./Search.js");
var idFilter = require("./IdFilter.js");
var fs = require('fs');

var collectedLinks = ['http://www.bing.com/search?q=%22latitude.google.com%2Flatitude%2Fapps%2Fbadge%2Fapi%3Fuser%3D%22'];
var collectedIDs = [];

var itemsProcessed = 0;
//do{
for (var i = 0; i < collectedLinks.length; i++) {
	search.crawlForLinks(collectedLinks[i], function(result){
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
			itemsProcessed++;
		});
	});
}
//}while(itemsProcessed<collectedLinks.length - 1);

//waitforsync(); //the whole waitforsync-ing is terrible quick and dirty bullshit

function waitforsync(){
	if(itemsProcessed<collectedLinks.length - 1){
		console.log("Number of gathered URLs: "+itemsProcessed);
		console.log("Number of gathered IDs: "+collectedLinks.length);
		wait(1000, waitforsync);
	}else{
		done();
	}
}

function wait(milisec, func){
	setTimeout((function() {
  		func();
	}), milisec);
}


function done(){
console.log("Number of gathered URLs: "+collectedLinks.length);
console.log("Number of gathered IDs: "+collectedLinks.length);
}
//for (var i = 1; i < collectedLinks.length; i++) {
//	idFilter.getIDsFromURL(collectedLinks[i], function(result){
		
//	});
//};

//var finder = search.Search();
