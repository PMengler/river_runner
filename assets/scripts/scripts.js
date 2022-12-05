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
      
        locations.push([data.sites[i].station_nm, // location name
                        data.sites[i].dec_lat_va, // latitude of location
                        data.sites[i].dec_long_va, // longitude of location
                        String(data.sites[i].stage), // stage of water surface at location
                        String(data.sites[i].flow), // instantaneous flowrate at location
                        data.sites[i].url]); // link to full usgs data about location
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
            const contentString = `<h3>${locations[i][0]}</h3>` + 
            `<p> Content </p>` +
            `<li> Stage: ${locations[i][3]} ft </li>` + 
            `<li> Flowrate: ${locations[i][4]} cfs </li>` +
            `<li> URL: <a href=${locations[i][5]}> https://waterdata.usgs.gov </a> </li>`;
            // infowindow.setContent(locations[i][0] + ' Stage: ' + locations[i][3] + ' ft,' + " Flowrate: " + locations[i][4] + ' cfs');
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
            }
        })(marker, i));
      }  
    })
    return;
  };

fetchButton.addEventListener('click', riverRunner);