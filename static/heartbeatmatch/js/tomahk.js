function loadTomahkTrack(tuneIndex){
    var pwidth = $('#tomahk').width();
    var pheight = $('#tomahk').height();
    var tomahkTrack = tomahkAPI.Track(track.tunes[tuneIndex].title,track.tunes[tuneIndex].artist, {
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

            },
            onresolved: function(resolver, result) {
            },
            ontimeupdate: function(timeupdate) {
            }
        }
    });
    $('#tomahk').html(tomahkTrack.render());
    tomahkTrack.play();
}

