function drawChart(){
    var chartdata = new google.visualization.DataTable();
    chartdata.addColumn('number', 'Time');
    chartdata.addColumn('number', 'HeartRate');
    chartdata.addColumn({type:'string', role:'annotation'}); 
    chartdata.addColumn({type:'string', role:'annotationText'}); 

    var chartOptions = {'title':'Heartrate', 'width': 450, 'height':300};
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    var maptrack = [];
    var tunesIndex = 1;
    var trackTitle = track.tunes[0].artist + " - " +track.tunes[0].title + " - " + track.trackpoints[0].heartrate + " bpm";

    chartdata.addRow([track.trackpoints[0].timedelta, track.trackpoints[0].heartrate, "1", trackTitle ]);
    for (var i=1;i<track.trackpoints.length-1;i++){
        var trackpoint = track.trackpoints[i];
        if (tunesIndex < track.tunes.length){
            var tune = track.tunes[tunesIndex];
            if(tune.playlistTime >= trackpoint.timedelta && tune.playlistTime <= track.trackpoints[i+1].timedelta ){
                trackTitle = track.tunes[tunesIndex].artist + " - " +track.tunes[tunesIndex].title + " - " + track.trackpoints[i].heartrate + " bpm";
                tunesIndex = tunesIndex+1;
                tune.lat = trackpoint.lat;
                tune.lon = trackpoint.lon;
                chartdata.addRow([{v: trackpoint.timedelta, f: trackpoint.time} , trackpoint.heartrate, tunesIndex.toString(), trackTitle]);
                maptrack.push([Number(trackpoint.lat), Number(trackpoint.lon), trackTitle ]);
            }else{
                chartdata.addRow([{v: trackpoint.timedelta, f: trackpoint.time} , trackpoint.heartrate, null, null]);
            }
        }else{
            chartdata.addRow([{v: trackpoint.timedelta, f: trackpoint.time}, trackpoint.heartrate, null, null]);
        }
    }
    
    chart.draw(chartdata, chartOptions);
}

function drawMap(){
    var center = new google.maps.LatLng(track.trackpoints[0].lat, track.trackpoints[0].lon);

    var mapOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        center: center,
        maxWidth:450
    };
    var map = new google.maps.Map(document.getElementById('map_div'), mapOptions);

    var maptrack = [];
    var tunesIndex = 1;
    var trackTitle = track.tunes[0].artist + " - " +track.tunes[0].title + " - " + track.trackpoints[0].heartrate + " bpm";
    var trackPathPoints = [];

    for (var i=1;i<track.trackpoints.length-1;i++){
        var trackpoint = track.trackpoints[i];
        var point = new google.maps.LatLng(trackpoint.lat,trackpoint.lon);
        trackPathPoints.push(point);
        if (tunesIndex < track.tunes.length){
            var tune = track.tunes[tunesIndex];
            if(tune.playlistTime >= trackpoint.timedelta && tune.playlistTime <= track.trackpoints[i+1].timedelta ){
                trackTitle = track.tunes[tunesIndex].artist + " - " +track.tunes[tunesIndex].title + " - " + track.trackpoints[i].heartrate + " bpm";
                track.tunes[tunesIndex].lat = trackpoint.lat;
                track.tunes[tunesIndex].lon = trackpoint.lon;
                tunesIndex = tunesIndex+1;   
                var marker = new google.maps.Marker({
                    map: map,
                    position: point,
                    title: trackTitle 
                    }); 
            }
        }
    }

    var trackPath = new google.maps.Polyline({
          path: trackPathPoints,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
    });
    var mapData = new google.visualization.DataTable();
    mapData.addColumn('number','Lat');
    mapData.addColumn('number','Lon');
    mapData.addColumn({type:'string', role:'annotation'}); 
    mapData.addRows(maptrack);

    trackPath.setMap(map);
    // mapz.draw(mapData, mapOptions);
}
