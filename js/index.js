$(document).ready(function() {
  // $('#newMovies').hide();
  // $('#submit').on('click', function(){
  //   $('#newMovies').show();
  //
  // });
  // $('#slide').hide();
  $('.after').hide();
  $('#submit').on('click', function() {
  $('#slide').show();
  $('.first').hide();
  $('.after').show();


});

  $('#newMovies').on('click', function() {
    $('#slide').hide();
    $('#result').append();

  });


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

//firebase

var config = {
    apiKey: "AIzaSyAG4m7pqDY_IKqp30gIu6YdXXTKfIS7vUU",
    authDomain: "reel-buddy.firebaseapp.com",
    databaseURL: "https://reel-buddy.firebaseio.com",
    projectId: "reel-buddy",
    storageBucket: "",
    messagingSenderId: "475413842755"
};
firebase.initializeApp(config);

var firebaseRef = firebase.database().ref();


$('#logout_button').hide();

$('#sign_up_form').on('submit', function(e){
  e.preventDefault();
  var email = $('#email_su_input').val();
  var password = $('#password_su_input').val();
  firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
    firebaseRef.child("Users").child(user.uid).set({email: email, zip_code: $('#zip_su_input').val()})
    $('#email_su_input').val("");
    $('#zip_su_input').val("")
    $('#password_su_input').val("");
  }).catch(function(error) {
    if(error){
      throw new Error(error.code + " : " + error.message);
    }
  });
});

$('#sign_in_form').on('submit', function(e){
  e.preventDefault();
  var email = $('#email_si_input').val();
  var password = $('#password_si_input').val();
  firebase.auth().signInWithEmailAndPassword(email, password).then((success) => {
    $('#email_si_input').val("");
    $('#password_si_input').val("");
  }).catch(function(error) {
    if(error){
      throw new Error(error.code + " : " + error.message);
    }
  });
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("User Signed In");


    firebaseRef.on("value", function(snapshot) {

      var users = snapshot.val().Users;
      for(var i in users){
        if(users[i].email == user.email){
          console.log(users[i])

        }
      }

    }, function(errorObject){
      console.log("Errors handled: " + errorObject.code)
    })

    $('#logout_button').show();
    $('#logout_button').on('click', function(){
      firebase.auth().signOut().then(function() {
        console.log("Signout Successful");
        $('#logout_button').hide();
      }, function(error) {
        throw new Error("Error: " + error);
      });
    })

    } else {
      console.log("No User Signed In")
    }
});



});
