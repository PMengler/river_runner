var fetchButton = document.getElementById('fetch-button');

//getApi function is called when the fetchButton is clicked

function getApi() {
  // Insert the API url to get a list of your repos
  var requestUrl = 'https://waterwatch.usgs.gov/webservices/realtime?region=or&format=json';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //looping over the fetch response and inserting the URL of your repos into a list
      for (var i = 190; i < 210; i++) {
        // console.log(data.sites[i]);
        console.log(data.sites[i].station_nm + ': ' + data.sites[i].dec_lat_va + ', ' + data.sites[i].dec_long_va
        + ' has an average flow of: ' + data.sites[i].flow + ' cfs');
      } 
    })
  };

fetchButton.addEventListener('click', getApi);

// Google Maps API

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// Initialize and add the map
function initMap() {
  // The location of Uluru
  var locations = [
        ['Willamette River, near Portland, OR', 45.5175, -122.669, 2],
        ['Fairview Creek at Glisan St, near Gresham, OR', 45.5276, -122.449, 1]
  ];
  
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: new google.maps.LatLng(45.5175, -122.669),
  });

  // The marker, positioned at Uluru
  // const marker = new google.maps.Marker({
  //   position: locations,
  //   map: map,
  // });

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
        infowindow.setContent(locations[i][0]);
        infowindow.open(map, marker);
        }
    })(marker, i));
  }  
};
window.initMap = initMap;