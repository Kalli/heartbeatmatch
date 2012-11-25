
track["tunes"] = [];
track["songlengths"] = [];
playlistDuration= 0;
trackpointIndex = 0;
var usedtunes = "";
var order = ["artist_familiarity-desc","artist_familiarity-asc","song_hotttnesss-asc","song_hotttnesss-desc", "danceability-desc"];

// Search for a track on Echonest by bpm
function findTuneByBPM(bpm, trackpointIndex){
    var sortOrder = order[Math.floor(Math.random()*order.length)];
    // console.log("http://developer.echonest.com/api/v4/song/search?api_key=HRRVBG3RPX0SXHSP2&results=10&min_tempo="+bpm+"&max_tempo="+bpm+"&format=json&bucket=tracks&bucket=id:deezer&limit=true&bucket=audio_summary&sort="+sortOrder);
    $.getJSON("http://developer.echonest.com/api/v4/song/search?api_key=HRRVBG3RPX0SXHSP2&results=10&min_tempo="+bpm+"&max_tempo="+(bpm+1)+"&format=json&bucket=tracks&bucket=id:deezer&limit=true&bucket=audio_summary&sort="+sortOrder,function(data){
        var index = Math.round(Math.random(1)*(data.response.songs.length-1));
        var tune = data.response.songs[index]; // get a random song so not all lists are alike
        track.tunes.push({"title":tune.title, "artist": tune.artist_name, "duration": Math.round(tune.audio_summary.duration), "playlistTime":playlistDuration,"bpm":bpm});
        playlistDuration += Math.round(tune.audio_summary.duration);
        populatePlaylist(trackpointIndex);
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
        drawChart();
        drawMap();
        renderPlaylist();
        // $('#controls').show();
        loadTomahkTrack(0);
    }
}

function renderPlaylist(){
    $('.thumbnails').show();
    $('#loading').hide();
    var playlist = $('<table class="table table-condensed table-striped" />');
    var head = $('<th id="iconholder"></th><th>Artist</th><th>Title</th><th>BPM</th>');
    head.appendTo(playlist);
    var totalBpm = 0;
    var maxBpm = 0;
    $.each(track.tunes,function(i,val){
        totalBpm += val.bpm;
        if (maxBpm <= val.bpm){
            maxBpm = val.bpm;
        }
        var row = $('<tr />');
        var td = $('<td>'+(i+1)+'.</td><td>' + val.artist + '</i></td><td>' + val.title + '</td><td>' + val.bpm + '</td>');
        td.appendTo(row);
        row.appendTo(playlist);
        $(td).click(function(){
            loadTomahkTrack(i);
        });
        $(row).mouseover(function(){
            $(this).find("td").first().html('<i class="icon-play"></i>');
            $(this).addClass("info");

        });
        $(row).mouseout(function(){
            $(this).find("td").first().html((i+1)+'.');
            if($(this).hasClass("info")){
                $(this).removeClass("info");
            }
        });
    });
    $("#playlist").append(playlist);
    $('#playlistinfo').append("<li>The playlist has "+track.tunes.length+" tracks.</li> <li>Average  bpm: " + Math.round(totalBpm/track.tunes.length) + "</li><li> Max bpm: " + maxBpm+"</li>");
    $('#info').show();
    $('#controlsback').click(function(){
        nowplaying-=1;
        loadTomahkTrack(nowplaying);
    });
    $('#controlsfwd').click(function(){
        nowplaying+=1;
        loadTomahkTrack(nowplaying);
    });
    $('#controlsplay').toggle(function(){
        tomahkTrack.pause();
        $('#controlsplay').attr("class","icon-play icon-white");
    },function(){
        tomahkTrack.play();
        $('#controlsplay').attr("class","icon-pause icon-white");
    });
}