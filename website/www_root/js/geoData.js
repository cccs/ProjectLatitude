function GeoData(waypointData, name){
  this.stats = {};
  this.name = name;
  if(name == undefined)this.name = "Unnamed Track";
	//this.stats.AverageActualizationTime = 0;
  //this.stats.FastestActualizationInterval = 0;
  //this.stats.BiggestActualizationGap = 0;

  //start and end Time are Timestamps 
  this.getWaypointsBetween = function(startTime, endTime){
    var ret = [];
    var length = waypoints.length;
    for(var i = 0; i<length;i++){
      var element = waypoints[i];
      var time = getTimestamp(element);
      if(time>startTime && time > endTime)ret.push(element);
    }
    return ret;
  }

    var calcStatistics = function(stats){
      var fastestActualization = 0;
      var biggestActualizationGap = 0;
      var averageActualization = 0;
      var length = waypoints.length;
      for (var i =  0; i < length -1; i++) {
        var element1 = waypoints[i];
        var element2 = waypoints[i+1];
        var time = (getTimestamp(element2) - getTimestamp(element1));
        
        averageActualization += time;
        if(fastestActualization == 0 || time<fastestActualization)fastestActualization = time;
        if(biggestActualizationGap == 0 || time>biggestActualizationGap)biggestActualizationGap = time;
      }
      averageActualization = averageActualization / (length - 1);
      
      var begin = getTimestamp(waypoints[0]);
      var end = getTimestamp(waypoints[length-1]);

      stats.AverageActualizationTime = averageActualization;
      stats.FastestActualizationInterval = fastestActualization;
      stats.BiggestActualizationGap = biggestActualizationGap;
      stats.TimeSpan = end-begin;
      stats.NumWaypoints = length;
      stats.BeginDate = new Date(begin*1000);
      stats.EndDate = new Date(end * 1000);
    }

    var timeSort = function(waypointArray){
      return waypointArray.sort(function(a,b){
          return getTimestamp(a)-getTimestamp(b);
        });
    }

    this.draw=function(map){
      for (var i = waypoints.length - 1; i >= 0; i--) {
        map.drawWaypoint(waypoints[i]);
        console.log(waypoints[i]);
      };
    }

    var getTimestamp = function(fromWaypoint){
      return fromWaypoint.features[0].properties.timeStamp;
    }
  waypoints = timeSort(waypointData);
  calcStatistics(this.stats);
}

function getLongitude(fromWaypoint){
    return fromWaypoint.features[0].geometry.coordinates[0];
  }

function getLatitude(fromWaypoint){
    return fromWaypoint.features[0].geometry.coordinates[1];
}

function createWaypoint(longitude, latitude, timestamp){
  var ret = {};
  ret.features = [];
  var data = {
    properties : {timeStamp : timestamp},
    geometry : {
      coordinates: [longitude, latitude]
    }
  };
  ret.features.push(data);
  return ret;
}

function createGeoDataFromGPX(gpxData){
  var ret = [];
  var xmlDoc = $.parseXML( gpxData );
    var $xml = $(xmlDoc);
    var tracksegments = $xml.find("trk");
    for (var i = tracksegments.length - 1; i >= 0; i--) { //für jeden track wird ein eigenes GeoData-Objekt angelegt
      var track = tracksegments[i];
      var trackName = $(track).find("name").text(); //Namen des Tracks auslesen
      var waypoints = [];
      var trackpoints = $(track).find("trkpt");
      for (var i = trackpoints.length - 1; i >= 0; i--) { //das GeoData-Objekt aus allen Waypoints/Trackpoints des Tracksegments erstellen
        var trackpoint = $(trackpoints[i]);
        var waypoint = createWaypoint(trackpoint.attr('lon'),trackpoint.attr('lat'), 0);
        waypoints.push(waypoint);
      };
    ret.push(new GeoData(waypoints, trackName)); //Neues GeoData - Objekt mit den Waypoints des Tracks und dessen Namen erstellen.
    };
    return ret;
}