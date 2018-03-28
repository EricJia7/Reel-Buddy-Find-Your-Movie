var button = document.querySelector('button')
var resultContainer = document.querySelector('#result')
button.addEventListener('click', function( ) {
  let movieName = $('#movie').val();


  $.ajax('http://api.themoviedb.org/3/movie/upcoming?api_key=6af6582e4eb5ba81b0db6b8c582d67a4&query='+


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
        $('#result').append('<img src="http://image.tmdb.org/t/p/w342// + poster">' + '<li><h3>'+ title + vote + '</h3><h1><strong>Overview: </strong> ' + overview + '</h1></li>');
      }
      console.log(response);
    })
    .fail(function(error) {
      console.log(error);
    });
})
