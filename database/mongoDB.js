//Initialization:
var mongo = require('mongoskin');
var nodeConfig = require('nconf');

var configurationFile = "../config/nodeConfig.json"
nodeConfig.file(configurationFile);
//console.log("Collection for Latitude IDs: "+constants.collections.latitudeIDs);

//Public:

/**
 * Inserts a WaypointCollection into the database.
 * Param wayPoint has to be a FeatureCollection (JSON-Object).
 * like this:
 * 		{ "type": "FeatureCollection",
 * 		"features": [
 * 		{ "type": "Feature", ...waypointdata }
 * 		]
 * 		}
*/
function insertWaypoint(wayPoint){
	wayPoint = parseFeatureCollection(wayPoint); //get all waypoints
	
	iterateOver(wayPoint, function(w){//add Every waypoint:...
		//dont do this asynchron: (will cause database to generate same user multiple time)
			addWaypoint(w);
		});
	
}

//calls "callback" with array with all id of Latitude User in WaypointData-Collection
function getLatitudeUserIds(callback){
	var constants = nodeConfig.get('database');
	var db = connectToDB();
	var collection = db.collection(constants.collections.waypoints);
	var ret = collection.find().toArray(function(err,data){
		//TODO error handling:
		callback(data);
		closeDBConnection(db);
	});
}

function getLatitudeUser(withId, callback){
	var constants = nodeConfig.get('database');
	var db = connectToDB();
	var collection = db.collection(constants.collections.waypoints);
	console.log("Searching for UserId "+withId);
	collection.findOne({userId : withId}, function(err, item){
		//TODO: error handling!
		callback(item);
		closeDBConnection(db);
	});
	
}

exports.getLatitudeUser = getLatitudeUser;
exports.getLatitudeUserIds = getLatitudeUserIds;
exports.insertWaypoint = insertWaypoint;

//Private functions:

function addLatitudeUser(userId){
	var user = {
		"userId" : userId,
		"waypoints" : []
	};
	insertDocumentIntoWaypointData(user);
}

function addWaypoint(wayPoint){
	var config = nodeConfig.get('database');
	var userId = wayPoint.properties.id;
	//console.log("Inserting "+JSON.stringify(wayPoint)+" into "+config.collections.waypoints);
	var db = connectToDB();
	getLatitudeUser(userId, function(user){
		if(user == null){
			addLatitudeUser(userId);
		}
		var collection = db.collection(config.collections.waypoints);
		collection.update({"userId": userId}, {$push:{waypoints: wayPoint}});
		//insertDocument(wayPoint, config.collections.waypoints, db);
		closeDBConnection(db);
	});
}


function connectToDB(){
	var constants = nodeConfig.get('database');
	var databaseString = "mongodb://"+constants.host+":"+constants.port+"/"+constants.name;
	return mongo.db(databaseString);	
}

function closeDBConnection(db){
	db.close();
}

function insertDocumentIntoWaypointData(doc){
	var config = nodeConfig.get('database');
	var db = connectToDB();
	insertDocument(doc, config.collections.waypoints, db);
	closeDBConnection(db);
}

function insertDocument(doc, intoCollection, db){
	var collection = db.collection(intoCollection);
	collection.save(doc);	
}

//Returns Array with inherited Features
function parseFeatureCollection(collection){
	console.log(collection.type);
	if(collection.type == "FeatureCollection"){
		var ret = []
		for(var i = 0 ; i<collection.features.length;i++){
			var features = parseFeatureCollection(collection.features[i]);
			for(var i2 = 0 ; i2<features.length;i2++){
			ret.push(features[i2]);
			}
		}
		return ret;
	}else{
		var ret = [collection];
		return ret;
	}
}

function iterateOver(array, func){
	for(var i=0;i<array.length;i++){
			func(array[i]);
	}
}

/*
Documentation (http://mongodb.github.com/node-mongodb-native/api-articles/nodekoarticle1.html#time-to-query)

Code: collection.update({mykey:1}, {$set:{fieldtoupdate:2}}, {w:1}, function(err, result) {});
Meaning: Right so this update will look for the document that has a field mykey equal to 1 and apply an update to the field fieldtoupdate setting the value to 2 . Since we are using the {w:1} option the result parameter in the callback will return the value 1 indicating that 1 document was modified by the update statement.
*/