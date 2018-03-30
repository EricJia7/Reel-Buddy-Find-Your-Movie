
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

var selMovies = [{}];

var responseTmdb = {};

var singleMv = "https://api.themoviedb.org/3/movie/";

var movieIdList = [];
var movieIdListBl = [];

function tmdbYTUrlKey(movieId) {
  var urlYt =  "http://api.themoviedb.org/3/movie/" + movieId + "/videos" + tmdbKey;
  $.ajax({
    url: urlYt,
    method: "GET"
  }).done(function(response){
    console.log(response);
    var results = response.results;
    return results[0].key;
    console.log(results[0].key);
  });
};
 
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
      var name = results[i].title;
      var poster =results[i].poster_path;
      var posterUrl = "https://image.tmdb.org/t/p/w500" + poster;
      var release_date = results[i].release_date;
      var vote = results[i].vote_average;
      var overview = results[i].overview;
      selMovies[i] = {
        "id": results[i].id,
        "name": results[i].title,
        "posterUrl": "https://image.tmdb.org/t/p/w500" + results[i].poster_path,
        "release_date": results[i].release_date,
        "vote": results[i].vote_average,
        "overview": results[i].overview,
        // "youtubeUrl": tmdbYTUrl(results[i].id),
      };
      console.log(name, posterUrl, release_date);
      console.log("movie id is: " + id);
    };
  });
};

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
  });
};


// mvGroupQuery(tmdbNowPlay);
// mvSingleQuery(354912)
mvGroupQuery(tmdbComing);

// setTimeout(function(){
//   for (var i = 0; i < 1; i++) {
//     mvSingleQuery(movieIdList[i]); };
// }, 100);



      // if(mvSingleQuery(id)) {
      //   console.log("we can add this movie now");
      // };
      // movieObj[i]["id"] = id;
      // movieObj[i]["name"] = name;
      // movieObj[i]["poster"] = poster;
      // movieObj[i]["posterUrl"] = posterUrl;
      // movieObj[i]["release_date"] = release_date;
      // movieObj[i]["vote"] = vote;
