const requestDataUrl = "http://localhost:8001/requests";
const dogwalkersDataURL = "http://localhost:8001/dogWalkers";
let distanceP, durationP;

window.onload = function () {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(
    new google.maps.Map(document.getElementById("map"))
  );
  calculateAndDisplayRoute(directionsService, directionsRenderer);
  displayTimeAndDuration();
};

async function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  try {
    // Get the query parameters from the URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const requestId = params.get("id");
    const dogwalkerId = params.get("dogwalkerId");

    // Fetch request and dogwalker data
    const requestResponse = await axios.get(`${requestDataUrl}/${requestId}`);
    const requestLocation = requestResponse.data.currentLocation;
    const dogwalkersResponse = await axios.get(
      `${dogwalkersDataURL}/${dogwalkerId}`
    );
    const destination = dogwalkersResponse.data.address;
    console.log(destination);

    if (!requestLocation) {
      alert(
        "Current position not found. Please ensure location services are enabled."
      );
      return;
    }

    // Calculate and display the route
    directionsService.route(
      {
        origin: destination,
        destination: requestLocation,
        travelMode: google.maps.TravelMode.WALKING,
      },
      function (response, status) {
        if (status === "OK") {
          directionsRenderer.setDirections(response);

          // Extract and display distance and duration
          const route = response.routes[0];
          const leg = route.legs[0];
          const distance = leg.distance.text;
          const duration = leg.duration.text;

          distanceP = distance;
          durationP = duration;
          displayTimeAndDuration();
        } else {
          alert("Directions request failed due to " + status);
        }
      }
    );
  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred while calculating the route. Please try again.");
  }
}

function displayTimeAndDuration() {
  const timeUntilArrivalDiv = document.getElementById("timeUntilArrival");
  timeUntilArrivalDiv.innerHTML = `
  <p>Distance: ${distanceP}</p>
  <p>Duration: ${durationP}</p>
  `;
}
