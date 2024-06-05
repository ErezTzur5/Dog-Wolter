let map;
let geocoder;
let directionsService;
let directionsRenderer;
let currentPosition;

function initMap() {
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

  const input = document.getElementById("address");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      console.log("No details available for input: '" + place.name + "'");
      return;
    }

    map.setCenter(place.geometry.location);
    new google.maps.Marker({
      map: map,
      position: place.geometry.location,
    });

    console.log("Selected Place: ", place);
  });

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

function loadGoogleMapsAPI() {
  return axios.get(
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyBzQ62BPJBOIsbVenJzMhUQQ2fIC8IZADs&libraries=places&callback=initMap",
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
  map.setCenter(pos);
  alert(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
}
