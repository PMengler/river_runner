var weatherAPIkey = '6c2804129ff3cbd5d74a5aa5eb917a4c';
var weather = [];
var locations = [];
var marker;
var destination;
let destinationLat;
let destinationLng;
let address;
let cityEl;
let stateEl;
let selectedRiverLat;
let selectedRiverLng;
let distance;
var pinLocationName = '';
var submitButton = document.getElementById('fetch-button');
var searchDropDown = document.getElementById('last-searches-dropdown');
var geocoder;
var map;
let lastSearchEl;
let container;

function initialize() {
  // initial map pre-destination search
  geocoder = new google.maps.Geocoder();
  var loca = new google.maps.LatLng(45.5152, -122.6784);

  map = new google.maps.Map(document.getElementById('map'), {
    center: loca,
    zoom: 11
  });
}

function calcDistance(fromLat, fromLng, toLat, toLng) {
  let distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
  //for an approximate result, divide the length value by 1609
  distance = (distanceInMeters / 1609).toFixed(2)
  return distance;
}

function createRiverMarker(latlng, html) {
  var pinColor = "2861ff";
  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
  new google.maps.Size(21, 34),
  new google.maps.Point(0,0),
  new google.maps.Point(10, 34));
  
  var riverMarker = new google.maps.Marker({
    position: latlng,
    map: map,
    icon: pinImage
  });
  
  google.maps.event.addListener(riverMarker, 'click', function () {
    selectedRiverLat = riverMarker.getPosition().lat();
    selectedRiverLng = riverMarker.getPosition().lng();
    calcDistance(destinationLat, destinationLng, selectedRiverLat, selectedRiverLng);

    let distanceInfo = `<li> Distance: ${distance} miles away</li>`
    let infowindow = new google.maps.InfoWindow();
    infowindow.setContent(html + distanceInfo);
    infowindow.open(map, riverMarker);
    
    weather = [];
    getPinLocationName();
    clearCurrentWeather();
    getWeather();
  });
  return riverMarker;
}

function saveSearch(city) {
  let getLocalStorage = localStorage.getItem('lastSearches');
  let localStorageArr = [];

  if (getLocalStorage) {
    localStorageArr = getLocalStorage.split(',');
  }

  // skips adding to local storage if its a duplicate entry
  for (var i = 0; i <= localStorageArr.length; i++) { 
    if (localStorageArr[i] == city) {
      return;
    }
  }
  localStorageArr.push(city);
  localStorage.setItem('lastSearches', localStorageArr)
}

function createContainer() {
  // creating a container for anchor attributes - this makes it easier to reset and clean up added anchors
  lastSearchEl = document.getElementById('search-history');
  container = document.createElement('div');
  lastSearchEl.appendChild(container);
}

function createAnchor(text) {
  let displaySearchEl = document.createElement('a');
  displaySearchEl.classList.add('search-result')
  displaySearchEl.classList.add('navbar-item')
  displaySearchEl.textContent = text;
  container.appendChild(displaySearchEl);
}

function displaySearchResults() {
  // get local storage and format into array
  let getLocalStorage = localStorage.getItem('lastSearches');
  let localStorageArr = [];
  
  if (getLocalStorage) {
    localStorageArr = getLocalStorage.split(',');
  }

  // clearing previously added anchor elements
  if (lastSearchEl) {
    let children = lastSearchEl.getElementsByTagName('a');
    if (children) {
      container.remove();
    }
  }

  createContainer();

  if (localStorageArr.length === 0) {
    let text = 'No Search History Available'
    createAnchor(text);
  }
 
  for (var i = 0; i < localStorageArr.length; i++) {
    createAnchor(localStorageArr[i])
  }

  $(document).on("click", ".search-result", function () {
    // overwrite displayed text in city
    let cityText = document.getElementById('city');
    cityText.value = this.textContent

    riverRunner(this.textContent)
  });
}

function riverRunner(place) {
  if (place == undefined) {
    cityEl = document.getElementById('city').value;
  } else {
    cityEl = place;
    if (marker && marker.setMap) {
    marker.setMap(null);
    }
  }
  stateEl = document.getElementById('state').value;
  address = `${cityEl}, ${stateEl}`;

  saveSearch(cityEl);
  
  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status == 'OK') {
      destination = results[0].geometry.location;
      map.setCenter(destination);
      marker = new google.maps.Marker({
          map: map,
          position: destination
      });
      destinationLat = marker.getPosition().lat();
      destinationLng = marker.getPosition().lng();
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

  // USGS water conditions API
  var requestWaterUrl = 'https://waterwatch.usgs.gov/webservices/realtime?region=or&format=json';

  fetch(requestWaterUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      
      //looping over the fetch response and inserting the data from the API to the locations array
      for (var i = 0; i < data.sites.length; i++) {

        locations.push([
          data.sites[i].station_nm, // station name
          data.sites[i].dec_lat_va, // latitude
          data.sites[i].dec_long_va, // longitude
          String(data.sites[i].stage), // stage in ft
          String(data.sites[i].flow), // flow in cubic feet per second
          data.sites[i].url, // URL for more data
        ])
      };
      
      for (let i = 0; i < locations.length; i++) {  
        var contentString = `<h3> ${locations[i][0]} </h3 contentString = 3>` +
                            // `<p> Weather: </p>` +
                            // `<li> Temperature: ${weather[i][0]} F` +
                            // `<li> Wind Speed: ${weather[i][1]} mph` +
                            `<p> Water Conditions: </p>` +
                            `<li> Stage: ${locations[i][3]} ft` +
                            `<li> Flowrate: ${locations[i][4]} cfs` +
                            `<li> URL: <a href=${locations[i][5]}> https://waterdata.usgs.gov </a> </li>`;

        createRiverMarker(new google.maps.LatLng(locations[i][1], locations[i][2]), contentString)
      }
    })
  return;
};
  
function getWeather() {
  var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${selectedRiverLat}&lon=${selectedRiverLng}&units=imperial&appid=${weatherAPIkey}`;
  fetch(requestUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // console.log(data);
      weather.push([
        data.current.temp, 
        data.current.wind_speed,
        data.current.uvi,
        data.current.weather[0].icon]);
        
      var currentWeatherEl = $('.message-body');

      currentWeatherEl.addClass('container'); //card text-white bg-dark mb-3

      // selected location in current weather card
      var locationNameEl = $('<h3>');
      locationNameEl.text(pinLocationName);
      currentWeatherEl.append(locationNameEl);

      // weather emoji for weather in current weather card
      var currentWeatherEmoji =  weather[0][3];
      var currentWeatherEmojiEl = $('<img>');
      currentWeatherEmojiEl.attr('src', "http://openweathermap.org/img/wn/" + currentWeatherEmoji + ".png");
      currentWeatherEl.append(currentWeatherEmojiEl);
      
      // temperature
      var currentTemp = weather[0][0];
      var currentTempEl = $('<li>');
      currentTempEl.text(`Temp: ${currentTemp} °F`)
      currentWeatherEl.append(currentTempEl);
      
      // get current wind speed and display
      var currentWind = weather[0][1];
      var currentWindEl = $('<li>')
      currentWindEl.text(`Wind: ${currentWind} mph`)
      currentWeatherEl.append(currentWindEl);
      
      // UV
      var currentUv = weather[0][2];
      var currentUvEl = $('<li>');
      currentUvEl.text(`UV Index: ${currentUv}`)
      currentWeatherEl.append(currentUvEl);
      
    });
    
    console.log(weather);
    return;
};

// Creating a card with weather info
function clearCurrentWeather () {
  var currentWeatherEl = $(".message-body");
  currentWeatherEl.empty();
  return;
};

function getPinLocationName () {
  for (var i = 0; i < locations.length; i++) {
    if (locations[i][1] == selectedRiverLat && locations[i][2] == selectedRiverLng) {
      pinLocationName = locations[i][0];
      return pinLocationName;
    }
  }
  // console.log(pinLocationName);
};

google.maps.event.addDomListener(window, 'load', initialize);
submitButton.addEventListener('click', function () {
  riverRunner();
  displaySearchResults();
});
searchDropDown.addEventListener('click', displaySearchResults)

