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
        reverseGeocode(currentPosition);

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
}

function loadGoogleMapsAPI() {
  return axios.get(
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyBzQ62BPJBOIsbVenJzMhUQQ2fIC8IZADs&callback=initMap",
    { timeout: 5000 }
  );
}

document.addEventListener("DOMContentLoaded", function () {
  loadGoogleMapsAPI()
    .then((response) => {
      console.log("Google Maps API loaded successfully");

      initMap();
    })
    .catch((error) => {
      console.error("Error loading Google Maps API:", error);
    });
});

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

function reverseGeocode(latlng) {
  geocoder.geocode({ location: latlng }, function (results, status) {
    if (status === "OK") {
      if (results[0]) {
        console.log("Address:", results[0].formatted_address);
        document.getElementById("current-location").value =
          results[0].formatted_address;
        return results[0].formatted_address;
      } else {
        console.error("No results found");
      }
    } else {
      console.error("Geocoder failed due to:", status);
    }
  });
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
