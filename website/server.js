var express = require('express');
var app = express();

app.use(express.static(__dirname + '/www_root'));

var server = app.listen(8080); // Port 8080 for Testing purposes. Port 80 needs root

var everyone = require("now").initialize(server); //initialize now

everyone.getLatitudeIds = function(){
	
}