
var waypoints = [];
var allWaypoints = [];
var mapCenter = {latitude: 0, longitude: 0};
var geoDataUrl = 'geoData.js';
var scope;

(function () {
var module = angular.module("angular-google-maps-example", ["google-maps"]);
}());

function playWay(inSeconds){
	var begin = getTimestamp(allWaypoints[0]);
	var timespan = getTimestamp(allWaypoints[allWaypoints.length-1]) - begin;

}

function getTimestamp(fromWaypoint){
	return fromWaypoint.features.timeStamp;
}



function loadWaypoints(){
	loadScript(geoDataUrl, function(){
	var waypoints = [];
	var length = geodata.length,
    element = null;
	for (var i = 0; i < length; i++) {
		var waypoint = {};
		element = geodata[i];
		waypoint.longitude = element.features[0].geometry.coordinates[0];
		waypoint.latitude = element.features[0].geometry.coordinates[1];
		waypoints.push(waypoint);
	}
	allWaypoints = waypoints;
	//callback(waypoints);
	});
}

function ExampleController ($scope, $timeout, $log) {
	scope = $scope;
  async.series([
    loadWaypoints(),
    startMap($scope, $timeout, $log)
	]);
    
}

function startMap($scope, $timeout, $log){
	// Enable the new Google Maps visuals until it gets enabled by default.
    // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    google.maps.visualRefresh = true;

	angular.extend($scope, {

		/*
		position: {
		coords: mapCenter
		},
		*/
		/** the initial center of the map 
		centerProperty: {
		latitude: 45,
		longitude: -73
		},
		*/
		centerProperty: mapCenter,
		
		
		/** the initial zoom level of the map */
		zoomProperty: 4,

		/** list of markers to put in the map 
		markersProperty: [ {
		latitude: 45,
		longitude: -74
		}],
		*/
		markersProperty: waypoints,

		// These 2 properties will be set when clicking on the map
		clickedLatitudeProperty: null,	
		clickedLongitudeProperty: null,

		eventsProperty: {
			click: function (mapModel, eventName, originalEventArgs) {	
				// 'this' is the directive's scope
				$log.log("user defined event on map directive with scope", this);
				$log.log("user defined event: " + eventName, mapModel, originalEventArgs);
			}
		},

		addWaypoint2Map: function(){
			var waypoint2Add = allWaypoints[waypoints.length];
			scope.markersProperty.push(waypoint2Add);
			scope.centerProperty = waypoint2Add;
		}

	});
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