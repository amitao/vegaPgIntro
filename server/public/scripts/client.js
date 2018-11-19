$( document ).ready( readyNow );

function readyNow(){
    console.log( 'JQ' );
    $('#addSongButton').on('click', addSong);
    getSongs();

} // end readynow

function addSong(){
    console.log('in addSong');
        // get user input
    // package in an object
    // send to server via AJAX
    const objectToSend ={
        artist: $('#artistIn').val(),
        published: $('#publishedIn').val(),
        rank: $('#rankIn').val(),
        track: $('#trackIn').val()
    }
    console.log('sending to server', objectToSend);
    $.ajax({
        method: 'POST',
        url: '/songs',
        data: objectToSend
    }).then( function(response){
        console.log(response);
        getSongs();
    }).catch(function(err){
        console.log(err);
    })
}

function getSongs(){
    $.ajax({
        method: 'GET',
        url: '/songs',
    }).then(function(response){
        console.log('back from GET with', response);
         $('#songsHis').empty()

         for (let x of response){
             $('#songsHis').append(`<li>${x.artist} ${x.published} ${x.rank} ${x.track}`);
         }
    }).catch(function(err){
        console.log('error getting data', err);
    })
}