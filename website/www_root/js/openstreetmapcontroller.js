
/**
 * Erklärung zur Darstellung von Overlays: http://docs.openlayers.org/library/overlays.html#overlays
*/

function createMap(mapdivID){
	var map = {};

	//Stores every displayed Marker:
	var markers = {};

	var waypointStyles = new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    pointRadius: "${type}", // sized according to type attribute
                    fillColor: "#ffcc66",
                    strokeColor: "#ff9933",
                    strokeWidth: 2,
                    graphicZIndex: 1
                }),
                "select": new OpenLayers.Style({
                    fillColor: "#66ccff",
                    strokeColor: "#3399ff",
                    graphicZIndex: 2
                })
            });


	map.createLonLat = function(longitude, latitude){
		return new OpenLayers.LonLat( longitude, latitude )
          .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            this.map.getProjectionObject() // to Spherical Mercator Projection
          );
	}

	map.deleteWaypoint = function(waypoint){
		this.deleteMarker(getWaypointMarker(waypoint));
	}

	map.deleteMarker = function(marker){
		points.removeFeatures(marker);
	}

	map.drawMarker = function(longitude, latitude){
		var feature = new OpenLayers.Feature.Vector(
		map.point(longitude, latitude),
		{
            type: 5
        });
		points.addFeatures(feature);

		return feature;
		//map.map.addLayer(points);
		/*
		var lonLat = this.createLonLat(longitude, latitude);

		var markers = new OpenLayers.Layer.Markers( "Markers" );
	    this.map.addLayer(markers);
	    
	    markers.addMarker(new OpenLayers.Marker(lonLat));
		return this;
		*/
	}

	map.drawLine = function(startPoint, endPoint){
		var vector = new OpenLayers.Layer.Vector();
		vector.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([startPoint, endPoint]))]);
		this.map.addLayers([vector]);
		return this;
	}

	function generateWaypointID(waypoint){
		var longitude = getLongitude(waypoint);
		var latitude = getLatitude(waypoint);
		//The unique ID of a waypoint is his Position:
		return ""+longitude+","+latitude+"";
	}

	function saveWaypointMarker(waypoint){
		markers[generateWaypointID(waypoint)] = waypoint;
	}

	function getWaypointMarker(waypoint){
		return markers[generateWaypointID(waypoint)];
	}

	map.drawWaypoint = function(waypoint){
		var longitude = getLongitude(waypoint);
		var latitude = getLatitude(waypoint);
		var ret = this.drawMarker(longitude, latitude);
		saveWaypointMarker(waypoint);
		return ret;
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

	//The private Variable, which stores the shown Waypoints
	var points = new OpenLayers.Layer.Vector("Points", {
                styleMap: waypointStyles,
                rendererOptions: {zIndexing: true}
            });
	map.map.addLayer(points);


	//var select = new OpenLayers.Control.SelectFeature(points, {hover: true});
   // map.map.addControl(select);
    //select.activate();

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



