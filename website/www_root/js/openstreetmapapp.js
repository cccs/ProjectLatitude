
var mapModule = angular.module('OpenStreetMap', []);
var map ;
mapModule.controller('MapCtrl', function($scope) {

	map = createMap("mapdiv");	
	map.setPosition(13.4127433, 52.5268753);

	$scope.importGPXDataCtrl = function() {
		var geoData = createGeoDataFromGPX($scope.inputFile); //in geoData befinden sich nun sämtliche in der inputFile gefunden GPX-Tracks als GeoData - Objekte
		for (var i = geoData.length - 1; i >= 0; i--) { //Alle Tracks abarbeiten...
			var newGeoData=geoData[i];
			// Add it to the TrackList:
			$scope.tracklist.push(newGeoData);
			newGeoData.draw(map);
		};
	}

	$scope.toggleMenu = function(){
		$scope.menuVisible = !$scope.menuVisible;
	}

	$scope.tracklist = [];

	$scope.menuVisible = false;

	$scope.inputFile = "";
 });

