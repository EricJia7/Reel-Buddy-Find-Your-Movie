// The Movie DB API call variables
var tmdbKey = "?api_key=6af6582e4eb5ba81b0db6b8c582d67a4";
var selRegion = "&region=US";
var selLanguage = "&language=en-US";
var selType = "&with_release_type=3";
var selSort = "&sort_by=popularity.desc";
var selPage1 = "&page=1";
var selPage2 = "&page=1";

var selTotalPages = "&total_pages=10";
var selTotalResults = "&total_results=40";

var usMvCompanies = ["Paramount", "Universal Pictures", "Legendary Pictures", "Warner Bros. Pictures", "Sony Pictures", "Sony Pictures Animation"]

// URL for movies currently show in theater. 
var tmdbComing = "https://api.themoviedb.org/3/movie/upcoming" + tmdbKey + selLanguage + selType + selSort + selPage1;

//URL for movies recently put off from the market. 
var tmdbNowPlay = "https://api.themoviedb.org/3/movie/now_playing" + tmdbKey + selLanguage + selType + selSort + selPage1;

//URL for most poplular movies. 
var tmdbPopular =  "https://api.themoviedb.org/3/movie/popular" + tmdbKey + selLanguage + selPage2;

//URL for single movie
var singleMv = "https://api.themoviedb.org/3/movie/";

var selMovies = [];

var responseTmdb = {};

var movieIdList = [];
var movieIdListBl = [];

var listBtnHtml = $('<button type="button" class="btn btn-danger" id="inTheaterBtn">Movies Now Playing</button> <button type="button" class="btn btn-danger" id="mostPopularBtn">Most Popular Movies</button> <button type="button" class="btn btn-danger" id="pastMovieBtn">Past Movies</button>');

//slide show variables
var $carousel = $('.carousel').flickity({
  initialIndex: 2,
  fullscreen: true,
  lazyLoad: 4, 
  wrapAround: true,
  autoPlay: 1500,
  pauseAutoPlayOnHover: true,
});

// Firebase read and write
var config = {
  apiKey: "AIzaSyDTn3DEHWxDZeOEk7RIhVgl9BvvL49hFxU",
  authDomain: "find-your-movie.firebaseapp.com",
  databaseURL: "https://find-your-movie.firebaseio.com",
  projectId: "find-your-movie",
  storageBucket: "",
  messagingSenderId: "87493737030"
};
firebase.initializeApp(config);

var database = firebase.database();


//Function to get Youtube URL for selected movie ID
function youtubeTrailerPlay(movieId) {
  
  var urlYt =  "https://api.themoviedb.org/3/movie/" + movieId + "/videos" + tmdbKey;
  $.ajax({
    url: urlYt,
    method: "GET"
  }).done(function(response){
    var results = response.results;
    youTubeId = results[0].key;
    var youTubeUrl = 'https://www.youtube.com/embed/' + youTubeId + '?autoplay=1&html5=1';
    $("#container_trailerVideo").empty().append($("<iframe></iframe>", {
      'id': 'trailerVideo',
      'src': youTubeUrl,
      'frameborder': 0
    }));
  }).fail(function(error) {
    console.log(error);
  });
};

//Function to query all the responded object and save it in browser
function mvGroupQuery(url) {
  // $("#movieSlide").empty();
  var urlInputGroup = url;
  $.ajax({
    url:urlInputGroup,
    method: "GET",
  }).done(function(response){
    var results = response.results;
    responseTmdb = response.results;
    $('.carousel').carousel({
      autoPlay: 2000
    });
    for(var i = 0; i<results.length; i++) {
      var id = results[i].id;
      movieIdList.push(id);
      var newObj = {
        "id": results[i].id,
        "name": results[i].title,
        "posterUrl": "https://image.tmdb.org/t/p/w500" + results[i].poster_path,
        "poasterHdUrl": "https://image.tmdb.org/t/p/w780" + results[i].poster_path,
        "release_date": results[i].release_date,
        "vote": results[i].vote_average,
        "overview": results[i].overview,
      };
      selMovies.push(newObj);
      addMvContainer(newObj);
      addMvSlide(newObj);
    };
  }).fail(function(error) {
    console.log(error);
  });
};

//This Function hasn't been used, it can check is the movies were made by a selected group of companies.
function mvSingleQuery(id) {
  console.log("function mvSingleQuery(id) called")
  var urlInputSingle = singleMv + id + tmdbKey;
  console.log("urlInputSingle")
  $.ajax({
    url:urlInputSingle,
    method: "GET",
  }).done(function(response){
    console.log(response);
    var result = response;
    var prdCompanies = result.production_companies;
    var knownCompany = false;
    prdCompanies.map(function (element, index) {
      console.log(element.name);
      if(usMvCompanies.indexOf(element.name)!= -1) {
        knownCompany = true;
      };
    if(knownCompany){
      console.log("here is a " + knownCompany + " one");
    } else {
      console.log("Here is a false one");
    };
    });
  }).fail(function(error) {
    console.log(error);
  });
};

function addMvContainer(arr) {
  // $("#movie-slide").hide();
  //newdcol will display the mv image, title and rating, call it the trailer video container
  var newdcol = $("<div>").addClass("col-lg-4 col-md-4 col-sm-4");
  //img show in this md-12 row
  var newrow1 = $("<div>").addClass("row");
  //text(title,rating) show here
  var newrow2 = $("<div>").addClass("row");

  var newcol1_left = $("<div>").addClass("col-lg-1 col-md-1col-sm-1");
  var newcol1_right= $("<div>").addClass("col-lg-1 col-md-1 col-sm-1");
  var newcol1 = $("<div>").addClass("col-lg-10 col-md-10 col-sm-10");

  var newcol2_1_left = $("<div>").addClass("col-lg-1 col-md-1 col-sm-1 text-center");
  var newcol2_1 = $("<div>").addClass("col-lg-8 col-md-8 col-sm-8 text-center");
  var newcol2_2 = $("<div>").addClass("col-lg-2 col-md-2 col-sm-2 text-center");
  var newcol2_2_right = $("<div>").addClass("col-lg-1 col-md-1 col-sm-1 text-center");

  var newImg = $("<img>")
    .attr("src",arr["posterUrl"])
    .addClass("img-fluid");
  newcol1.append(newImg);
  newrow1.append(newcol1_left);
  newrow1.append(newcol1);
  newrow1.append(newcol1_right);

  var newp1 = $("<p>")
    .addClass("mvTitle text-center text-uppercase")
    .text(arr["name"]);
  var newp2 = $("<p>")
    .addClass("mvTitle text-center text-uppercase")
    .text(arr["vote"]);

  newcol2_1.append(newp1);
  newcol2_2.append(newp2);

  newrow2.append(newcol2_1_left).append(newcol2_1).append(newcol2_2).append(newcol2_2_right);

  newdcol.append(newrow1);
  newdcol.append(newrow2);
  //add movie id to the movie display container
  newdcol.attr("id", arr["id"])
    .addClass("trailer-video-container")
    .attr("data-toggle", "modal")
    .attr("data-target", "#modalVideo");

  // $("#movieContainer").append(newdcol);
  $("#movieContainer").show("slow", function() {
    $(this).append(newdcol)
  });

};

function inTheaterDisplay() {
  $("#inTheaterBtn").click(function(event){
    $("#movieContainer").empty();
    RmMvSlide();
    // $("#movieContainer").css("background-color", "white" );
    event.preventDefault();
    selMovies = [];
    mvGroupQuery(tmdbComing);
  });  
};

function pastMovieDisplay() {
  $("#pastMovieBtn").click(function(event){
    $("#movieContainer").empty();
    RmMvSlide();
    // $("#movieContainer").css("background-color", "white" );
    event.preventDefault();
    selMovies = [];
    mvGroupQuery(tmdbNowPlay);
  });
};

function mostPopularDisplay() {
  $("#mostPopularBtn").click(function(event){
    $("#movieContainer").empty();
    RmMvSlide();
    // $("#movieContainer").css("background-color", "white" );
    event.preventDefault();
    selMovies = [];
    mvGroupQuery(tmdbPopular);
  });
};

//Display all the Available Button
function btnDisplay(str) {
  var email = str;
  var name = email.substring(0, email.lastIndexOf("@"));
  $("#sign_in_form").remove();
  $("#heading").append('<div class="col-lg-12 col-md-12 col-sm-12 text-uppercase" id = "helloDisplay">Hi ' + name + '</div>')
  $("#heading").append('<div class="col-lg-12 col-md-12 col-sm-12"> <button type="button" class="btn btn-danger" id="inTheaterBtn">Movies Now Playing</button> <button type="button" class="btn btn-danger" id="mostPopularBtn">Most Popular Movies</button> <button type="button" class="btn btn-danger" id="pastMovieBtn">Past Movies</button> </div>');
  inTheaterDisplay();
  pastMovieDisplay();
  mostPopularDisplay();
};

// Remove all current slides of movie
function RmMvSlide() {
  var cellElements = $carousel.flickity('getCellElements')
  cellElements.map(ele => $carousel.flickity('remove', ele));
};

function addMvSlide(arr) {
  $carousel.flickity('reloadCells')
  var $cellElems = $('<img class="carousel-image" data-flickity-lazyload="' + arr["posterUrl"] + '"/>' );
  $carousel.flickity('append', $cellElems);
}; 

function logUser(userlog,emaillog,zipcodelog) {
  var ref = database.ref("users");
  var obj = {
    "user": userlog,
    "email": emaillog,
    "zipcode": zipcodelog,
  };
  ref.push(obj);
};

function alertMessage(str) {
  $("#aletMsg").empty();
  $("#aletMsg")
    .css("color","red")
    .css("margin-bottom","2em")
    .addClass("text-center text-uppercase align-middle")
    .text(str);
};

$("#signUpBtn").click(function(event){
  $("#divZipIn").append('<input type="text" class="form-control" id="zipInput" placeholder="Zipcode"/>');
  $("#btnCol").append('<button class="btn btn-success btn-sm text-uppercase align-middle" id="enterBtn" type="button">Enter </button>');
  $("#signUpBtn").remove();
  $("#signInBtn").remove();
  $("#enterBtn").click(function(event){
    var email = $("#emailInput").val();
    var password = $("#passwordInput").val();
    var zipcode = $("#zipInput").val();
    console.log(email,password,zipcode);
    firebase.auth().createUserWithEmailAndPassword(email,password).then(function(){
      signUpUser = firebase.auth().currentUser;
      console.log("The Current User is", signUpUser);
      logUser(signUpUser.uid,email,zipcode);
      $('#emailInput').val("");
      $('#passwordInput').val("")
      $('#zipInput').val("");
    }, function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      if (errorCode == "auth/weak-password") {
        alertMessage("Password too week");
      } else if (errorCode == 'auth/email-already-in-use') {
        alertMessage("Email Registered");
      } else if (errorCode == 'auth/invalid-email') {
        alertMessage("Invalid Email");
      };
    });
  });
});

firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
    var email = user.email;
    var uid = user.uid;
    btnDisplay(email);
  };
});

$("#signInBtn").click(function(event){

  var email = $("#emailInput").val();
  var password = $("#passwordInput").val();
  console.log(email,password);

  firebase.auth().signInWithEmailAndPassword(email, password).then((success) => {
    console.log("This is successful!!")
    $('#emailInput').val("");
    $('#passwordInput').val("");
  }).catch(function(error) {
    if(error){
      throw new Error(error.code + " : " + error.message);
      console.log("Something wrong!");
    };
  });
});


//Click to see more info about the movie and watch youtube Trailer
$(document).on("click", ".trailer-video-container", function(event){
  var mvId = $(this).attr("id");
  youtubeTrailerPlay(mvId);
});

// when close the youtube page, stop playing the video in backend. 
$(document).on("click", "#closeModal", "#modal",function(event){
  $("#container_trailerVideo").empty();
});



// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     console.log("User Signed In");

//     firebaseRef.on("value", function(snapshot) {

//       var users = snapshot.val().Users;
//       for(var key in users){
//         if(users[key].email == user.email){
//           console.log(users[key])

//         }
//       }

//     }, function(errorObject){
//       console.log("Errors handled: " + errorObject.code)
//     }) 
//   }}
