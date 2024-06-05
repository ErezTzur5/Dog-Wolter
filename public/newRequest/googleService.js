let map;
let geocoder;
let directionsService;
let directionsRenderer;
let currentPosition;

function initMap() {
  //initializes the Google Map, sets up geocoding, directions service, and renderer.
  //it also sets the initial map center to the user's current position if available.

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 32.08732603245494, lng: 34.80405370566349 },
    zoom: 17,
  });
  geocoder = new google.maps.Geocoder();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log(currentPosition);
        map.setCenter(currentPosition);
        new google.maps.Marker({
          map: map,
          position: currentPosition,
        });
      },
      function () {
        handleLocationError(true, map.getCenter());
      },
      { enableHighAccuracy: true }
    );
  } else {
    handleLocationError(false, map.getCenter());
  }

  document.getElementById("submit").addEventListener("click", function () {
    geocodeAddress(geocoder, map);
  });

  document
    .getElementById("currentLocation")
    .addEventListener("click", function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            currentPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            map.setCenter(currentPosition);
            new google.maps.Marker({
              map: map,
              position: currentPosition,
            });
          },
          function () {
            handleLocationError(true, map.getCenter());
          },
          { enableHighAccuracy: true }
        );
      } else {
        handleLocationError(false, map.getCenter());
      }
    });

  document.getElementById("navigate").addEventListener("click", function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}

function geocodeAddress(geocoder, resultsMap) {
  //converts an address to geographic coordinates (latitude and longitude) and adds a marker to the map at that location.
  const address = document.getElementById("address").value;
  geocoder.geocode({ address: address }, function (results, status) {
    if (status === "OK") {
      resultsMap.setCenter(results[0].geometry.location);
      new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });
      console.log(resultsMap);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  //calculates and displays a walking route between the user's current position and a destination address specified by the user.
  //it also displays the distance and duration of the route.
  const destinationAddress = document.getElementById("address").value;
  if (!currentPosition) {
    alert(
      "Current position not found. Please ensure location services are enabled."
    );
    return;
  }

  directionsService.route(
    {
      origin: currentPosition,
      destination: destinationAddress,
      travelMode: google.maps.TravelMode.WALKING,
    },
    function (response, status) {
      if (status === "OK") {
        directionsRenderer.setDirections(response);

        // distance and duration values
        const route = response.routes[0];
        const leg = route.legs[0];
        const distance = leg.distance.text;
        const duration = leg.duration.text;

        console.log("Distance: " + distance);
        console.log("Duration: " + duration);
      } else {
        alert("Directions request failed due to " + status);
      }
    }
  );
}

function handleLocationError(browserHasGeolocation, pos) {
  //handles errors related to geolocation.
  //if geolocation is not supported by the browser or if the Geolocation service fails, it alerts the user.
  map.setCenter(pos);
  alert(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
}
