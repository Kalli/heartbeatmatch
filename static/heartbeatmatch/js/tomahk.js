var tomahkTrack;
function loadTomahkTrack(tuneIndex){
    var move = true;
    var pwidth = $('#tomahk').width();
    var pheight = $('#tomahk').height();
    tomahkTrack = tomahkAPI.Track(track.tunes[tuneIndex].title,track.tunes[tuneIndex].artist, {
        width: pwidth,
        height: pheight,
        disabledResolvers: [],
        handlers: {
            onloaded: function() {
            },
            onended: function() {
                tuneIndex += 1;
                loadTomahkTrack(tuneIndex);
            },
            onplayable: function() {
                tomahkTrack.play();
            },
            onresolved: function(resolver, result) {
            },
            ontimeupdate: function(timeupdate) {
                // var percent =100*(timeupdate.currentTime/timeupdate.duration);
                // $('#progressbar').css("width",percent.toFixed(1).toString()+"%");
                var trackTime = Math.round(timeupdate.currentTime+track.tunes[tuneIndex].playlistTime);
                if(Math.round(timeupdate.currentTime)%3===0){
                    move = false;
                    for(var i=track.tunes[tuneIndex].trackPoint;i<=track.tunes[tuneIndex+1].trackPoint;i++){
                        if (trackTime>=track.trackpoints[i].timedelta && trackTime<track.trackpoints[i+1].timedelta){
                            var point = new google.maps.LatLng(track.trackpoints[i].lat, track.trackpoints[i].lon);
                            runner.setPosition(point);
                            map.setCenter(point);
                            move = true;
                            break;
                       }

                   }
                }
                
            }
        }
    });
    $('#tomahk').html(tomahkTrack.render());
    $('#playlist').find('tbody').children().each(function(){
        $(this).removeClass("success");
    });
    $('#playlist').find('tbody').children(':nth-child('+(tuneIndex+1)+')').addClass("success");
    var point = new google.maps.LatLng(track.tunes[tuneIndex].lat, track.tunes[tuneIndex].lon);
    runner.setPosition(point);
    map.setCenter(point);
    runner.setTitle(track.tunes[tuneIndex].artist + " - " + track.tunes[tuneIndex].title + " - " + track.tunes[tuneIndex].bpm+" BPM");
    // $('#progressbar').html(track.tunes[tuneIndex].artist + " - " + track.tunes[tuneIndex].title + " - " + track.tunes[tuneIndex].bpm+" BPM");
    // $('#progressbar').css("width","0%");
    // var percentage = track.tunes[tuneIndex].playlistTime/track.duration;
    // $('#trackprogress').css("width",percentage.toString()+"%");
    tomahkTrack.play();
}

