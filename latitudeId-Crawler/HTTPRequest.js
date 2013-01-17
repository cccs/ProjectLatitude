var http = require("http");
var url = require("url");

function curl(urlpath, callback){

parsedUrl = url.parse(urlpath);

var options = {
  host: parsedUrl.host,
  port: parsedUrl.port,
  path: parsedUrl.path
};

if(options.port == undefined)options.port = 80;

console.log("HTTP-Request for "+url+" with Options:\n"+options.host+"\n"+options.port+"\n"+options.path);

http.get(options, function(res) {
  	console.log("Got response from "+ url +" : " + res.statusCode);
  
  	var retStr = "";

  	res.on('data', function(chunk) {  
           retStr += chunk;
           //console.log("Body: " + chunk);   
           
      	});   
  	res.on('end', function () {
  		console.log("Body: " + retStr); 
    		callback(retStr);
  		});
	}).on('error', function(e) {
  console.log("Got error at fetching "+ url +" : " + e.message);
  callback("");
});
}

exports.curl = curl;