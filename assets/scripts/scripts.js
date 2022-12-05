var fetchButton = document.getElementById('fetch-button');
var locations = [];
//getApi function is called when the fetchButton is clicked

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
        console.log(data.sites[i]);
        // console.log(data.sites[i].station_nm + ': ' + data.sites[i].dec_lat_va + ', ' + data.sites[i].dec_long_va
        // + ' has an average flow of: ' + data.sites[i].flow + ' cfs');

        locations.push([data.sites[i].station_nm, data.sites[i].dec_lat_va, data.sites[i].dec_long_va, String(data.sites[i].stage), String(data.sites[i].flow)]);
      } 
      // console.log(locations);
      
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
            infowindow.setContent(locations[i][0] + ' Stage: ' + locations[i][3] + ' ft,' + " Flowrate: " + locations[i][4] + ' cfs');
            infowindow.open(map, marker);
            }
        })(marker, i));
      }  
    })
    return;
  };

fetchButton.addEventListener('click', riverRunner);