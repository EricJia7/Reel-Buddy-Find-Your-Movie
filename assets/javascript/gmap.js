$(document).ready(function () {
  var map;
  var myOptions = {
      zoom: 11,
      center: new google.maps.LatLng(40.5461171, -74.3646122),
      mapTypeId: 'terrain'
  };
  map = new google.maps.Map($('#map_canvas')[0], myOptions);

  var addresses = ['AMC Dine-in Theatres Menlo Park 12', 'AMC Loews New Brunswick 18', 'Regal Hadley Theatre Stadium 16','Rutgers Cinema'];

  for (var x = 0; x < addresses.length; x++) {
      $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+addresses[x]+'&sensor=false', null, function (data) {
          var p = data.results[0].geometry.location
          var latlng = new google.maps.LatLng(p.lat, p.lng);
          new google.maps.Marker({
              position: latlng,
              map: map
          });

      });
  }

});