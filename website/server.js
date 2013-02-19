var express = require('express');
var app = express();

app.use(express.static(__dirname + '/www_root'));

app.listen(8080); // Port 8080 for Testing purposes. Port 80 needs root