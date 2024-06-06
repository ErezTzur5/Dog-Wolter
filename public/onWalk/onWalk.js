import { swalService } from "../swalServices.js";
import { calculateAverageRating } from "../requestProperties/requestPropertiesController.js";

const requestDataUrl = "http://localhost:8001/requests";
const dogwalkersDataURL = "http://localhost:8001/dogWalkers";
const dogwolterInfo = document.getElementById("dogwolter-info");
let distanceP, durationP;

window.onload = function () {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(
    new google.maps.Map(document.getElementById("map"))
  );
  window.gfg = gfg;
  window.updateRatingData = updateRatingData;
  showDogwolter();
  swalService.showSucssesToast("Your DogWolter is on their way!");
  calculateAndDisplayRoute(directionsService, directionsRenderer);
  displayTimeAndDuration();
};

async function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  try {
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
  <div id="distance">Distance remaining: ${
    distanceP ? distanceP : "loading..."
  }</div>
  <div id="duration">Time remaining: ${
    durationP ? durationP : "loading..."
  }</div>
  `;
  startCountdown(distanceP, durationP);
}

function startCountdown(distance, duration) {
  const distanceDiv = document.getElementById("distance");
  const durationDiv = document.getElementById("duration");
  const dogwalkerStatus = document.querySelector("h1");
  let totalDistance = parseFloat(distance.split(" ")[0]);
  let totalTime = parseInt(duration.split(" ")[0]);
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const requestId = params.get("id");

  let distancePerSecond = totalDistance / totalTime;

  let interval = setInterval(() => {
    if (totalTime > 0) {
      totalTime -= 1;
      totalDistance -= distancePerSecond;

      distanceDiv.innerText = `Distance remaining: ${totalDistance.toFixed(
        1
      )} km`;
      durationDiv.innerText = `Time remaining: ${totalTime} mins`;
    } else {
      clearInterval(interval);
      distanceDiv.classList.add("hidden");
      durationDiv.classList.add("hidden");
      dogwalkerStatus.innerText = "Your dogwolter has arrived!";
      swalService.arriveToast(requestDataUrl, requestId);
    }
  }, 1000);
}

async function showDogwolter() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const dogwalkerId = params.get("dogwalkerId");
  try {
    const response = await axios.get(`${dogwalkersDataURL}/${dogwalkerId}`);
    const dogwalker = response.data;
    const img = dogwalker.img;
    const dogwalkerName = dogwalker.name;
    const address = dogwalker.address;
    const description = dogwalker.description;
    const rating = dogwalker.rating;
    const phone = dogwalker.phoneNumber;
    dogwolterInfo.innerHTML = `
    <img class = "popup-pic" src="${img}" alt="dogWalkerPic"">
    <h1 class = "popup-header"><b>${dogwalkerName}</b></h1>
    <p class = "popup-phone-number"><b>Phone Number:</b> ${phone}</p>
    <p class = "popup-address"><b>Address:</b> ${address}</p>
    <p class = "popup-description"><b>Description:</b> ${description}</p>
    <p class = "popup-rating"><b>Rating:</b> ${calculateAverageRating(
      rating
    )}</p>
  `;
  } catch (e) {
    console.log(e);
  }
}

let stars = document.getElementsByClassName("star");
let userRating = 0;

function gfg(n) {
  let cls;
  remove();
  for (let i = 0; i < n; i++) {
    if (n == 1) cls = "one";
    else if (n == 2) cls = "two";
    else if (n == 3) cls = "three";
    else if (n == 4) cls = "four";
    else if (n == 5) cls = "five";
    stars[i].className = "star " + cls;
  }
  userRating = n;
}

function remove() {
  let i = 0;
  while (i < 5) {
    stars[i].className = "star";
    i++;
  }
}

async function updateRatingData(dogwalkerId) {
  const dataURL = "http://localhost:8001/dogWalkers";
  const dogwalkersResponse = await axios.get(`${dataURL}/${dogwalkerId}`);
  const ratings = dogwalkersResponse.data.rating;
  ratings.push(userRating);
  const newUrl = "http://127.0.0.1:5500/public/home/homePage.html";
  await axios
    .patch(`${dataURL}/${dogwalkerId}`, {
      rating: ratings,
    })
    .then((result) => {
      window.location.href = newUrl;
      // success
    })
    .catch((err) => {
      // error
    });
}
