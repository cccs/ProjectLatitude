//Initialization:
var mongo = require('mongoskin');
var nodeConfig = require('nconf');

var configurationFile = "../config/nodeConfig.json"
nodeConfig.file(configurationFile);
//console.log("Collection for Latitude IDs: "+constants.collections.latitudeIDs);

//Public:

/**
 * Inserts a Waypoint into the database.
 * Param wayPoint has to be an JSON-Object.
*/
function insertWaypoint(wayPoint){
	var config = nodeConfig.get('database');
	var db = connectToDB();
	console.log("Inserting "+JSON.stringify(wayPoint)+" into "+config.collections.waypoints);
	insertDocument(wayPoint, config.collections.waypoints, db);
	closeDBConnection(db);
}

exports.insertWaypoint = insertWaypoint;


//Private functions:

function connectToDB(){
	var constants = nodeConfig.get('database');
	var databaseString = "mongodb://"+constants.host+":"+constants.port+"/"+constants.name;
	return mongo.db(databaseString);	
}

function closeDBConnection(db){
	db.close();
}

function insertDocument(doc, intoCollection, db){
	var collection = db.collection(intoCollection);
	collection.save(doc);	
}