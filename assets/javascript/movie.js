
var tmdbKey = "?api_key=6af6582e4eb5ba81b0db6b8c582d67a4";
var selRegion = "&region=US";
var selLanguage = "&language=en-US";
var selType = "&with_release_type=3";
var selSort = "&sort_by=popularity.desc";
var selPage = "&page=1";
var selTotalPages = "&total_pages=10";
var selTotalResults = "&total_results=40";

var usMvCompanies = ["Paramount", "Universal Pictures", "Legendary Pictures", "Warner Bros. Pictures", "Sony Pictures", "Sony Pictures Animation"]

var tmdbComing = "http://api.themoviedb.org/3/movie/upcoming" + tmdbKey + selLanguage + selType + selSort + selPage;

var tmdbNowPlay = "http://api.themoviedb.org/3/movie/now_playing" + tmdbKey + selLanguage + selType + selSort + selPage;

var selMovies = [];

var responseTmdb = {};

var singleMv = "https://api.themoviedb.org/3/movie/";

var movieIdList = [];
var movieIdListBl = [];

//Function to get Youtube URL for selected movie ID
function tmdbYTUrlKey(movieId) {
  var urlYt =  "http://api.themoviedb.org/3/movie/" + movieId + "/videos" + tmdbKey;
  $.ajax({
    url: urlYt,
    method: "GET"
  }).done(function(response){
    console.log("Here is youtube id ajax response: " + response);
    var results = response.results;
    console.log(results[0].key);
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
    console.log(response);
    var results = response.results;
    responseTmdb = response.results
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
      addMv2Page(newObj);
      console.log(newObj);
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
      console.log("here is a " + knownCompany + " one")
    } else {
      console.log("NO~~~~~~~~~~~~")
    };
    });
  }).fail(function(error) {
    console.log(error);
  });
};

function addMv2Page(arr) {
    var newdcol = $("<div>").addClass("col-lg-4 col-md-4 col-sm-4");
    var newrow1 = $("<div>").addClass("row");
    var newrow2 = $("<div>").addClass("row");
    var newcol1 = $("<div>").addClass("col-lg-12 col-md-12 col-sm-12");
    var newcol2_1 = $("<div>").addClass("col-lg-8 col-md-8 col-sm-8 text-center");
    var newcol2_2 = $("<div>").addClass("col-lg-4 col-md-4 col-sm-4 text-center");

    var img = '<img src='+ arr["posterUrl"] +">";
    console.log(img);
    var title1 = '<h4>'+ arr["name"] + '</h4>';
    var title2 = '<h4>' + arr["vote"] + '</h4>' 

    newcol2_1.append(title1)
    newcol2_2.append(title2)
    newcol1.append(img);

    newrow1.append(newcol1);
    newrow2.append(newcol2_1);
    newrow2.append(newcol2_2);

    newdcol.append(newrow1);
    newdcol.append(newrow2);

    newdcol.attr("id", arr["id"]);

    $("#movieContainer").append(newdcol);
    console.log("~~~~~~~~~~~~~~~");
};


$("#inTheaterBtn").click(function(event){
  event.preventDefault();
  selMovies = [];
  mvGroupQuery(tmdbComing);
});

$("#pastMovieBtn").click(function(event){
  event.preventDefault();
  selMovies = [];
  mvGroupQuery(tmdbNowPlay);
});

      

