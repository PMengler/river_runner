var locations = [];

var submitButton = document.getElementById('fetch-button');

var geocoder;
var map;
var infowindow;

function initialize() {
  // initial map pre-destination search
  geocoder = new google.maps.Geocoder();
  var loca = new google.maps.LatLng(45.5152, -122.6784);

  map = new google.maps.Map(document.getElementById('map'), {
    center: loca,
    zoom: 11
  });
}

function riverRunner() {
  // gets destination input and centers and marks map
  let cityEl = document.getElementById('city').value;
  let stateEl = document.getElementById('state').value;
  let address = `${cityEl}, ${stateEl}`;
  
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

  // Insert the API url to get a list of your repos
  var requestUrl = 'https://waterwatch.usgs.gov/webservices/realtime?region=or&format=json';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      
      //looping over the fetch response and inserting the URL of your repos into a list
      for (var i = 0; i < data.sites.length; i++) {

        locations.push([
          data.sites[i].station_nm, // station name
          data.sites[i].dec_lat_va, // latitude
          data.sites[i].dec_long_va, // longitude
          String(data.sites[i].stage), // stage in ft
          String(data.sites[i].flow), // flow in cubic feet per second
          data.sites[i].url, // URL for more data
        ]); 
      } 
      
      var marker, i;
        
        for (i = 0; i < locations.length; i++) {  
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
          });
        
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
            const contentString = `<h3> ${locations[i][0]} </h3>` +
                                  `<p> Content </p>` +
                                  `<li> Stage: ${locations[i][3]} ft` +
                                  `<li> Flowrate: ${locations[i][4]} cfs` +
                                  `<li> URL: <a href=${locations[i][5]}> https://waterdata.usgs.gov </a> </li>`;
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
            }
        })(marker, i));
      }  
    })
    return;
};

google.maps.event.addDomListener(window, 'load', initialize);
submitButton.addEventListener('click', riverRunner);