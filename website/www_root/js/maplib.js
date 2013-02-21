
function createMap(mapdivID){
	var map = {};

	map.createLonLat = function(longitude, latitude){
		return new OpenLayers.LonLat( longitude, latitude )
          .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            this.map.getProjectionObject() // to Spherical Mercator Projection
          );
	}

	map.drawMarker = function(longitude, latitude){
		var lonLat = this.createLonLat(longitude, latitude);

		var markers = new OpenLayers.Layer.Markers( "Markers" );
	    this.map.addLayer(markers);
	 
	    markers.addMarker(new OpenLayers.Marker(lonLat));
		return this;
	}

	map.drawLine = function(startPoint, endPoint){
		var vector = new OpenLayers.Layer.Vector();
		vector.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([startPoint, endPoint]))]);
		this.map.addLayers([vector]);
		return this;
	}

	/**
	 * Takes an Array of waypoints as parameter
	 * Draws them onto the map
	*/
	map.drawWay = function(way){
		var that = this;
		iterateOver( way, function(data){
			that.drawMarker(data.longitude, data.latitude);
		});

		return this;
	}

	map.point = function(longitude, latitude){
		return new OpenLayers.Geometry.Point(longitude, latitude).transform(new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
	            this.map.getProjectionObject() // to Spherical Mercator Projection
	          );
	}

	map.setPosition = function(longitude, latitude){
	var lonLat = this.createLonLat( longitude, latitude );

    this.map.setCenter (lonLat, this.zoom);
	}

	map.map = new OpenLayers.Map(mapdivID);
	map.map.addLayer(new OpenLayers.Layer.OSM());
	map.zoom = 11;

return map;
}

function createAnimationObject(mapobject){
	anim = {};
	anim.map = mapobject;

	anim.waypoints = new Array();

	anim.addWaypoint = function(waypoint){
		//TODO: Validate waypoint object
		this.waypoints.push(waypoint);
		return this;
	}

	anim.drawStateAt = function(time){
		var waypoints = this.waypoints;
		var way = {};//

		iterateOver(waypoints, function(data){
			if(data.timestamp<time){
				if(way[data.userId] == null){
					way[data.userId] = new Array();
				}
				way[data.userId].push(data);
			}
		});

		for (var w in way){ //for every persons way
			if(isArray(way[w])){
				way[w].sort(function(a,b){ //sort
					return a.timestamp - b.timestamp; 
				});
				
				this.map.drawWay(way[w]); //Draw it on map
			
			}
		}
		return this;
  }
	return anim;
}

function iterateOver(array, func){
	for(var i=0;i<array.length;i++){
			func(array[i]);
	}
}

function createWaypoint(timestamp, longitude, latitude, range, userId){
	waypoint = {};
	
	waypoint.timestamp = timestamp;
	waypoint.userId = userId;
	waypoint.longitude = longitude;
	waypoint.latitude = latitude;
	waypoint.range = range;

	return waypoint;
}

function isArray(value){
	return (value && typeof value === "object" && value.constructor === Array);
}
