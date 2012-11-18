
track["tunes"] = [];
track["songlengths"] = [];
playlistDuration= 0;
trackpointIndex = 0;
var usedtunes = "";

// Search for a track on Echonest by bpm
function findTuneByBPM(bpm, trackpointIndex){
    //max_energy 0< x < 1
    var energy = bpm/track["maxHeartrate"];
    if(Math.round(energy)==1){
        energy = energy.toFixed(1)-0.4;
    }
    console.log("http://developer.echonest.com/api/v4/song/search?api_key=HRRVBG3RPX0SXHSP2&results=10&min_tempo="+bpm+"&max_tempo="+bpm+"&artist_min_familiarity=0.5&format=json&bucket=tracks&bucket=id:deezer&limit=true");
    // "&min_energy="+energy.toFixed(1)+
    $.getJSON("http://developer.echonest.com/api/v4/song/search?api_key=HRRVBG3RPX0SXHSP2&results=10&min_tempo="+bpm+"&max_tempo="+bpm+"&artist_min_familiarity=0.5&format=json&bucket=tracks&bucket=id:deezer&limit=true",function(data){
    // $.getJSON("http://developer.echonest.com/api/v4/song/search?api_key=HRRVBG3RPX0SXHSP2&results=10&style=electronica&min_tempo="+bpm+"&max_tempo="+bpm+"&format=json&bucket=tracks&bucket=id:deezer&limit=true",function(data){
        deezer_ids = [];
        for(var i=0;i<data.response.songs.length;i++){
            if(usedtunes.indexOf(data.response.songs[i].tracks[0].foreign_id.substring(13)==-1)){
                deezer_ids.push(data.response.songs[i].tracks[0].foreign_id.substring(13));
                usedtunes = usedtunes + data.response.songs[i].tracks[0].foreign_id.substring(13);
            }
        }
        getDeezerInformation(deezer_ids,0,trackpointIndex);
    });
}

// Search for a track on deezer
function getDeezerInformation(track_ids, idx, trackpointIndex){
    DZ.getLoginStatus(function(response) {
        if (response.authResponse) {
            DZ.api("/track/"+track_ids[idx],function(response){
                if (response["readable"]){
                    response["playlistTime"]=Number(playlistDuration);
                    track["tunes"].push(response);
                    playlistDuration = playlistDuration + Number(response["duration"]);
                    populatePlaylist(trackpointIndex);
                    usedtunes = usedtunes+response["id"];
                }else{
                    if (idx < track_ids.length){
                        getDeezerInformation(track_ids,idx+1,trackpointIndex);
                    }
                }
            });
        } else {
            DZ.login(function(response) {
               if (response.authResponse) {
                 console.log('Welcome!  Fetching your information.... ');
                 DZ.api('/user/me', function(response) {
                   console.log('Good to see you, ' + response.name + '.');
                 });
               } else {
                 console.log('User cancelled login or did not fully authorize.');
               }
             });
        }
    });
    
}

function populatePlaylist(trackpointIndex){
    if (playlistDuration < track["duration"]){
        var bpm;
        for (var i = trackpointIndex; i<track["trackpoints"].length;i++){
            if (track["trackpoints"][i+1]["timedelta"]>playlistDuration && track["trackpoints"][i]["timedelta"]<=playlistDuration){
                trackpointIndex = i;
                bpm = track["trackpoints"][i]["heartrate"];
                break;
            }
        }
        findTuneByBPM(bpm,trackpointIndex);
    }else{
        deezer_ids=[];
        for(var j=0;j<track["tunes"].length;j++){
            var tune = track["tunes"][j];
            deezer_ids.push(tune["id"]);
        }
        DZ.player.playTracks(deezer_ids);
        draw2();
    }
}