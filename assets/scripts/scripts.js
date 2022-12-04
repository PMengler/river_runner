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
  const willametteRiverPortland = {
        lat: 45.125,
        lng: -122.073
    }
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: willametteRiverPortland,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: willametteRiverPortland,
    map: map,
  });
}

window.initMap = initMap;