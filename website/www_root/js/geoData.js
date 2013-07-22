function GeoData(waypointData){
  this.stats = {};
	//this.stats.AverageActualizationTime = 0;
  //this.stats.FastestActualizationInterval = 0;
  //this.stats.BiggestActualizationGap = 0;

  //start and end Time are Timestamps 
  this.getWaypointsBetween = function(startTime, endTime){
    var ret = [];
    var length = waypoints.length;
    for(var i = 0, i<length;i++){
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

    var getTimestamp = function(fromWaypoint){
      return fromWaypoint.features[0].properties.timeStamp;
    }
  waypoints = timeSort(waypointData);
  calcStatistics(this.stats);
}
