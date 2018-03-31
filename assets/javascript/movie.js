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
var tmdbComing = "http://api.themoviedb.org/3/movie/upcoming" + tmdbKey + selLanguage + selType + selSort + selPage1;

//URL for movies recently put off from the market. 
var tmdbNowPlay = "http://api.themoviedb.org/3/movie/now_playing" + tmdbKey + selLanguage + selType + selSort + selPage1;

//URL for most poplular movies. 
var tmdbPopular =  "https://api.themoviedb.org/3/movie/popular" + tmdbKey + selLanguage + selPage2;

//URL for single movie
var singleMv = "https://api.themoviedb.org/3/movie/";

var selMovies = [];

var responseTmdb = {};

var movieIdList = [];
var movieIdListBl = [];

var selMvYt = "";

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
function tmdbYTUrlKey(movieId,id) {
  selMvYt = "";
  var urlYt =  "http://api.themoviedb.org/3/movie/" + movieId + "/videos" + tmdbKey;
  $.ajax({
    url: urlYt,
    method: "GET"
  }).done(function(response){
    var results = response.results;
    selMvYt = results[0].key;
    console.log(selMvYt);
    addModal(id);
  }).fail(function(error) {
    console.log(error);
  });
};

//Function to query all the responded object and save it in browser
function mvGroupQuery(url) {
  var urlInputGroup = url;
  $.ajax({
    url:urlInputGroup,
    method: "GET",
  }).done(function(response){
    var results = response.results;
    responseTmdb = response.results;
    for(var i = 0; i<results.length; i++) {
      var id = results[i].id;
      movieIdList.push(id);
      var newObj = {
        "id": results[i].id,
        "name": results[i].title,
        "posterUrl": "https://image.tmdb.org/t/p/w500" + results[i].poster_path,
        "release_date": results[i].release_date,
        "vote": results[i].vote_average,
        "overview": results[i].overview,
      };
      selMovies.push(newObj);
      addMvContainer(newObj);
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

  $("#movie-slide").hide();
  
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
    .addClass("mvTitle text-center")
    .text(arr["name"]);
  var newp2 = $("<p>")
    .addClass("mvTitle text-center")
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
    .attr("data-target", "#"+arr["id"]+"Modal");

  // $("#movieContainer").append(newdcol);
  $("#movieContainer").show("slow", function() {
    $(this).append(newdcol)
  });

};

function addModal(str) {
  console.log("!!!!!!!!!!!!!" + str);
  $(".modalIndicator").attr("id",str);
  console.log("!!!!!!!!!!!!!")
  console.log($(".modal .fade .modalIndicator"));
};

$("#inTheaterBtn").click(function(event){
  $("#movieContainer").empty();
  // $("#movieContainer").css("background-color", "white" );
  event.preventDefault();
  selMovies = [];
  mvGroupQuery(tmdbComing);
  $(".trailer-video-container").on("click", ".img-fluid",function(event){
    alert("ha")
  });
});

$("#pastMovieBtn").click(function(event){
  $("#movieContainer").empty();
  // $("#movieContainer").css("background-color", "white" );
  event.preventDefault();
  selMovies = [];
  mvGroupQuery(tmdbNowPlay);
});

$("#mostPopularBtn").click(function(event){
  $("#movieContainer").empty();
  // $("#movieContainer").css("background-color", "white" );
  event.preventDefault();
  selMovies = [];
  mvGroupQuery(tmdbPopular);
});

$(document).on("click", ".trailer-video-container", function(event){
  var mvId = $(this).attr("id");
  var dataTarget = $(this).attr("data-target").replace("#","");
  console.log(mvId, dataTarget);
  tmdbYTUrlKey(mvId,dataTarget);
});
      
function addMvSlide(arr) {
  $("#movieContainer").empty();
  var imgSlide = $("<img>")
    .addClass("carousel-image")
    .attr("src",arr["posterUrl"])
  $("#movie-slide").append(imgSlide)
};

