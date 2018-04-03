// ******************************variables related with TMDB API start
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
// ******************************variables related with TMDB API end

// ******************************variables related with Firebase NoSQL databse start
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

// ******************************variables related with Firebase NoSQL databse end

// ******************************variables related with TMS API start
var tmsMovies = new Array();
var tmsKey = "nvp8skju7ngwxgvf56t3772x";
var tmsKey1 = "k652j8wurjgybvrj3v9w65pa";
var tmsKey1 = "22ajvn98zuj3e3646kg3rbpg";
var tmsKey1 = "bb4j4x5rtvymem5u5chcnvhz";

var todayDate = new Date();
var startDate = "2018-04-01";
var todayDateLocal = formatDate(todayDate);
var baseUrl = "http://data.tmsapi.com/v1.1/movies/showings?startDate=";
var tmsURL = "";
// ******************************variables related with TMS API end

//******************************* Google Map api start

var geocodeApiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var googleKey = "&key=AIzaSyD1LfJv5lgVtzf7s0z1k0IojTx8fOp7rbY"
var gmapUrl;
var gmapTheaterUrl;

var curLocation = {
  zip: 0,
  lat: 0,
  lng: 0,
  cityName: "",
  stateName: "",
};
//******************************* Google Map api end

//slide show variables
var $carousel = $('.carousel').flickity({
  initialIndex: 2,
  fullscreen: true,
  lazyLoad: 4, 
  wrapAround: true,
  autoPlay: 1500,
  pauseAutoPlayOnHover: true,
});

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

//Function to get Youtube URL for selected movie ID
function youtubeTrailerPlay(movieId,movieName) {
  
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
    $("#findTheaterBtn")
      .attr("data-zipcode",curLocation.zip)
      .attr("data-mvName",movieName);
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
    .attr("data-target", "#modalVideo")
    .attr("data-mvname",arr["name"]);

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
function btnDisplay(emailStr,zipStr) {
  var email = emailStr;
  var name = email.substring(0, email.lastIndexOf("@"));
  $("#sign_in_form").remove();
  $("#heading").append('<div class="col-lg-12 col-md-12 col-sm-12 text-capitalize" id = "helloDisplay">Hi  ' + name + '  from  ' + zipStr + '</div>');
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
  var ref = database.ref().child("Users");
  var data = {
    "user": userlog,
    "email": emaillog,
    "zipcode": zipcodelog
  };
  ref.child(userlog).set(data).then(function(ref){
    console.log("Firebase Data Saved")
  },function(error){
    console.log(errpr);
  });
};

function alertMessage(str) {
  $("#aletMsg").empty();
  $("#aletMsg")
    .css("color","red")
    .css("margin-bottom","2em")
    .addClass("text-center text-uppercase align-middle alertDisplay")
    .text(str);
};

$("#signUpBtn").click(function(event){
  $("#divZipIn").append('<input type="text" class="form-control inputForm" id="zipInput" placeholder="Zipcode"/>');
  $("#btnCol").append('<button class="btn btn-success btn-sm text-uppercase align-middle submitBtn" id="enterBtn" type="button">Enter </button>');
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

$("#signInBtn").click(function(event){
  var email = $("#emailInput").val();
  var password = $("#passwordInput").val();
  console.log(email,password);
  firebase.auth().signInWithEmailAndPassword(email, password).then((success) => {
    console.log("This is successful!!")
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    if (errorCode == "auth/user-not-found") {
      alertMessage("Email Not Found buddy");
    } else if (errorCode == 'auth/wrong-password') {
      alertMessage("Wrong Password buddy");
    } else if (errorCode == 'auth/invalid-email') {
      alertMessage("Invalid Email buddy");
    };
  });
});

// check if user has been signed in
firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
    console.log("onAuthStateChanged is running");
    var email = user.email;
    var uid = user.uid;
    getFbZip(uid,email);
  };
});

function getFbZip(id,email) {
  console.log("getFbZip is running");
  database.ref("Users").child(id).once("value").then(function(snapshot) {
    var zip = snapshot.val().zipcode;
    curLocation.zip = zip;
    tmsURL = baseUrl + todayDateLocal + "&zip=" + curLocation.zip + "&api_key=" + tmsKey;
    gmapUrl= geocodeApiUrl + curLocation.zip + googleKey + "&sensor=false";
    btnDisplay(email,zip);
    findMvLocation(tmsURL);
    getZipLatLng(gmapUrl);
  });
};

//Click to see more info about the movie and watch youtube Trailer
$(document).on("click", ".trailer-video-container", function(event){
  var mvId = $(this).attr("id");
  var mvName = $(this).attr("data-mvname");
  youtubeTrailerPlay(mvId,mvName);
});

// when close the youtube page, stop playing the video in backend. 
$(document).on("click", "#closeModal", "#modal",function(event){
  $("#container_trailerVideo").empty();
});

// click the "Find Theater" button to display the list of movie theaters around the zip to show the movie
$("#findTheaterBtn").click(function(event){
  var selZip = $(this).attr("data-zipcode");
  var selName = $(this).attr("data-mvname");
  console.log("When Find Theater Btn clicked, the zipcode is: " + selZip);
  console.log("When Find Theater Btn clicked, the movie name is: " + selName);
  theaterDisplay(selName);
});

function findMvLocation(url) {
  // api can only make 50 calls per day, limited the call per each user
  if(tmsMovies.length != 0) {
    return;
  };
  console.log("findMvLocation function run");
  var urlLocation = url;
  $.ajax({
    url: urlLocation,
    method: "GET"
  }).done(function(response){
    console.log(response);
    var results = response;
    results.map((currElement,index) => {
      var singleMv = {};
      singleMv["title"] = currElement.title;
      singleMv["shortDescription"] = currElement.shortDescription;
      singleMv["releaseDate"] = currElement.releaseDate;
      singleMv["showTimes"] = currElement.showtimes;
      singleMv["theater"] = new Object();
      getMvTheaterShowTime(singleMv);
      tmsMovies.push(singleMv);
    });
  });
};

function getMvTheaterShowTime(obj) {
  var showTimeArr = obj.showTimes;
  for (var i = 0; i < showTimeArr.length; i++ ) {
    var showObj = showTimeArr[i];
    if(!(showObj.theatre.name in obj["theater"])) {
      // selected name of movie theater as the Object key, the value is an array.
      obj['theater'][showObj.theatre.name]= [];
      obj['theater'][showObj.theatre.name].push(moment(showObj.dateTime).format('LT'));
    } else {
      obj['theater'][showObj.theatre.name].push(moment(showObj.dateTime).format('LT'));
    };
  };
};

function getZipLatLng(str) {
  var geocodeApiUrl = str;
  console.log(geocodeApiUrl)
  $.ajax({
    url:geocodeApiUrl,
    method: "GET"
  }).done(function(response){
    result = response.results[0];
    curLocation.lat = result["geometry"].location.lat;
    curLocation.lng = result["geometry"].location.lng;
    curLocation.cityName = result["address_components"][1].long_name;
    curLocation.stateName = result["address_components"][3].short_name;
    console.log("Current User's zip location is: " + curLocation);
  });
};

function theaterDisplay(str) {
  var movieName = str;
  console.log("HiHi, this is the movie" + movieName);
  $("#movieContainer").hide();
  for(var i=0;i<tmsMovies.length;i++){
    if(similarity(tmsMovies[i].title,movieName)) {
      singleTheaterDisplay(tmsMovies[i].title,tmsMovies[i].releaseDate,tmsMovies[i].shortDescription,tmsMovies[i].theater);
      initMap(Object.keys(tmsMovies[i].theater));
    }
  }
};

function singleTheaterDisplay(nameStr,dateStr,descriptionStr,theaterArr) {
  console.log("singleTheaterDisplay Name is: " + nameStr);
  console.log("singleTheaterDisplay Date is: " + dateStr);
  console.log("singleTheaterDisplay Name is: " + descriptionStr);
  console.log(theaterArr);
};

function initMap(arr) {
  if(!arr) {
    return;
  };
  var map;
  var mapOptions = {
      zoom: 11,
      center: new google.maps.LatLng(curLocation.lat, curLocation.lng),
      mapTypeId: 'roadmap'
  };

  console.log(mapOptions);

  map = new google.maps.Map($('#theaterContainer')[0], mapOptions);

  console.log(map);

  for (var i = 0; i < arr.length; i++) {
      $.getJSON(geocodeApiUrl + arr[i] + googleKey + '&sensor=false', null, function (response) {
          var pLat = response.results[0]["geometry"].location.lat;
          var pLng = response.results[0]["geometry"].location.lng;
          var latlng = new google.maps.LatLng(pLat, pLng);
          new google.maps.Marker({
              position: latlng,
              map: map
          });
      });
    };
};

//check the similarity between two movies names as there is no map between the movie id provided by Gracenote tmsapi and the moviedb api;
function similarity(s1, s2) {
  var longer;
  var shorter;
  if (s1.length < s2.length) {
    longer = s2.replace(/:/g,'').replace(/ 3D/g,'');
    shorter = s1.replace(/:/g,'').replace(/ 3D/g,'');
  } else {
    longer = s1.replace(/:/g,'').replace(/ 3D/g,'');
    shorter = s2.replace(/:/g,'').replace(/ 3D/g,'');
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  var result = (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  console.log(result);

  if(result>=0.8) {
    return true;
  } else {
    return false;
  }
};

//calculate the Levenshtein distance between two strings. 
function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};