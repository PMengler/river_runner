APIkey = 'AIzaSyDZMxrOcwvMPEtvRL8YuYM4DJAH6kNw2Fw';
var fetchButton = document.getElementById('fetch-button');
var locations = [];
//getApi function is called when the fetchButton is clicked

var geocoder;
var map;
var infowindow;

function initialize() {
  geocoder = new google.maps.Geocoder();
  var loca = new google.maps.LatLng(41.7475, -74.0872);

  map = new google.maps.Map(document.getElementById('map'), {
    // mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: loca,
    zoom: 8
  });
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
//   var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'mouseover', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

function codeAddress() {
  var address = document.getElementById('address').value;
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
}



function riverRunner() {
  // Insert the API url to get a list of your repos
  var requestUrl = 'https://waterwatch.usgs.gov/webservices/realtime?region=or&format=json';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      
      //looping over the fetch response and inserting the URL of your repos into a list
      for (var i = 0; i < data.sites.length; i++) {

        locations.push([data.sites[i].station_nm, // station name
                        data.sites[i].dec_lat_va, // latitude
                        data.sites[i].dec_long_va, // longitude
                        String(data.sites[i].stage), // stage in ft
                        String(data.sites[i].flow), // flow in cubic feet per second
                        data.sites[i].url]); // URL for more data
      } 
      console.log(locations);
      
      // Google Maps API
      /**
       * @license
       * Copyright 2019 Google LLC. All Rights Reserved.
       * SPDX-License-Identifier: Apache-2.0
       */

      // console.log(locations);
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: new google.maps.LatLng(45.5175, -122.669),
      });
    
      // Adds all markers in locations variable
      var infowindow = new google.maps.InfoWindow();
      
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

fetchButton.addEventListener('click', riverRunner);
google.maps.event.addDomListener(window, 'load', initialize);