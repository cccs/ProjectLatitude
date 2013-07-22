var NUM_DUMMY_WAYPOINTS = 10000;

function printDummyWaypoints(num){
	var output = 'var geodata = [';
	for(var time = 0; time < num*600; time+=600){
		var longitude = 13 + Math.random()*5;
		var latitude = 52 + Math.random()*5;
		var data = createWaypoint(longitude, latitude, time);
		output += '\n';
		output += JSON.stringify(data);
		output += ',';

	}
	
    output = output.substring(0,output.length - 1);
    output += '\n];';
    console.log(output);
}

function createWaypoint(longitude, latitude, timestamp){
	var ret = { "type": "FeatureCollection",
		"features": [
		{ "type": "Feature",
		"geometry": {"type": "Point", "coordinates": [longitude, latitude]},
		"properties": {
		"timeStamp": timestamp
		}
		}
		]
		}
		return ret;
}

printDummyWaypoints(NUM_DUMMY_WAYPOINTS);