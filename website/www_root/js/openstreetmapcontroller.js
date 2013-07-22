
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

	map.drawWaypoint = function(waypoint){
		this.drawMarker(getLongitude(waypoint), getLatitude(waypoint));
	}

	/**
	 * Takes an Array of waypoints as parameter
	 * Draws them onto the map
	*/
	map.drawWay = function(way){
		var that = this;
		iterateOver( way, function(data){
			that.drawMarker(data.getLongitude(), data.getLatitude());
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


function getLongitude(fromWaypoint){
		return fromWaypoint.features[0].geometry.coordinates[0];
	}

function getLatitude(fromWaypoint){
		return fromWaypoint.features[0].geometry.coordinates[1];
}

function isArray(value){
	return (value && typeof value === "object" && value.constructor === Array);
}



function loadScript(url, callback)
{
    // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

   // then bind the event to the callback function 
   // there are several events for cross browser compatibility
   script.onreadystatechange = callback;
   script.onload = callback;

   // fire the loading
   head.appendChild(script);
}