$(document).ready(function() {
  // $('#newMovies').hide();
  // $('#submit').on('click', function(){
  //   $('#newMovies').show();
  //
  // });

  $('')

  $('#newMovies').on('click', function() {
    $('#slide').hide();
    $('#result').append();

  });


var button = document.querySelector('button')
var resultContainer = document.querySelector('#result')
button.addEventListener('click', function( ) {
let movieName = $('#movie').val();


  $.ajax('http://api.themoviedb.org/3/movie/upcoming?api_key=6af6582e4eb5ba81b0db6b8c582d67a4&query='+
//new api will have api + zipcode (from firebase object)

   movieName)
    .done(function(response) {
      $('#result').empty();



      for (var i = 0; i < response.results.length; i++) {
        let movie = response.results[i];
        let title = movie.title;
        let vote = movie.vote_average;
        let overview = movie.overview;
        let poster =movie.poster_path;
        console.log(movie);

        var newdiv = $("<div>")
          .addClass("col-lg-6 col-md-6 col-sm-6")

        var newhtml = '<img src=http://image.tmdb.org/t/p/w342//' + poster + '>' + '<h4>'+ title +" "+""+ vote + '</h4>'
        newdiv.append(newhtml)

        $('#result').append(newdiv);
      //   var button = $('<button>', {
      //     text: "Click to Find this Movie",
      //     class: 'locationSearch'
      //   })
      //   $('#result').append(button);
      }
      console.log(response);
    })
    .fail(function(error) {
      console.log(error);
    });
})


});
