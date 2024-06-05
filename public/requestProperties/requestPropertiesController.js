import {
  addRequestToDom,
  updateData,
  deleteRequest,
  showDogwalkerProperties,
  showToast,
} from "./requestPropertiesService.js";

import { swalService } from "../swalServices.js";

document.addEventListener("DOMContentLoaded", async function () {
  const dataURL = "http://localhost:8001/requests";
  const params = new URLSearchParams(window.location.search);
  const requestId = params.get("id");
  const data = await addRequestToDom(dataURL, requestId);
  const propertiesDiv = document.getElementById("requestProperties");
  propertiesDiv.innerHTML = `
  <h3 class = "user-location">your location:</h3>
  <p class = "user-location-data">${data.currentLocation}</p>
  <h3 class = "dog-walker-request-time">When you want the DogWolter:</h3>
  <p class = "dog-walker-request-data">${data.currentTime}</p>
  <h3 class = "trip-duration"> Trip Duration:</h3>
  <p class = "trip-duration-data"> ${data.timeDuration} minutes</p>
  <button class = "cta-button delete-request-btn" onclick="onClickDeleteButton(this)">delete your request</button>
  `;
  const dogwalkersDataURL = "http://localhost:8001/dogWalkers";
  addRandomDogWalkersToDom(dogwalkersDataURL, 3);
});

window.onload = onInit();

function onClickDeclineButton(svgElement) {
  try {
    const dogwalkerCard = svgElement.parentNode;
    const dogwalkerGrandparent = dogwalkerCard.parentNode;
    dogwalkerGrandparent.remove();
    swalService.showErrorToast("You choose to decline this DogWolter");
  } catch (e) {
    swalService.showErrorToast("There was an error decline this DogWolter");
  }
}

function onClickDeleteButton() {
  deleteRequest();
}

async function onClickShowDogwalkerButton(svgElement) {
  try {
    const propetries = await showDogwalkerProperties(svgElement);
    showToast(
      propetries.img,
      propetries.dogwalkerName,
      propetries.phone,
      propetries.address,
      propetries.description,
      calculateAverageRating(propetries.rating)
    );
  } catch (e) {
    swalService.showErrorToast("There was an error show this DogWolter");
  }
}

function onClickAcceptButton(svgElement) {
  const divElem = svgElement.parentNode;
  const divElemGrandparent = divElem.parentNode;
  const dogwalkerId =
    divElemGrandparent.querySelector("#walker-id").textContent;
  const params = new URLSearchParams(window.location.search);
  const requestId = params.get("id");
  const newUrl = `http://127.0.0.1:5500/public/onWalk/onWalk.html?id=${encodeURIComponent(
    requestId
  )}&dogwalkerId=${encodeURIComponent(dogwalkerId)}`;

  window.location.href = newUrl;
}

function calculateAverageRating(dogWalker) {
  const sum = dogWalker.reduce((acc, curr) => acc + curr, 0);
  const average = sum / dogWalker.length;

  const fixAverage = parseFloat(average.toFixed(1));

  return fixAverage;
}

function addRandomDogWalkersToDom(URL, count) {
  const availableDogwalkersDiv = document.getElementById("availableDogwalkers");
  axios
    .get(URL)
    .then((response) => {
      const dogWalkers = response.data;
      const randomDogWalkers = getRandomDogWalkers(dogWalkers, count);
      randomDogWalkers.forEach((dogwalker) => {
        const dogwalkerCard = document.createElement("div");
        dogwalkerCard.classList.add("walker-info-card");
        dogwalkerCard.setAttribute("id", "dogwalkerCard");

        const img = document.createElement("img");
        img.src = dogwalker.img;
        img.alt = "dogWalkerPhoto";
        img.classList.add("walker-image");

        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttons-div");

        const detailDiv = document.createElement("div");
        detailDiv.classList.add("detail-div");

        detailDiv.onclick = (function (currentDogwalker) {
          return function () {
            onClickShowDogwalkerButton(currentDogwalker);
          };
        })(dogwalker);

        const nameParagraph = document.createElement("p");
        nameParagraph.classList.add("walker-name");
        nameParagraph.textContent = dogwalker.name;

        const ratingParagraph = document.createElement("p");
        ratingParagraph.classList.add("walker-rating");
        ratingParagraph.innerHTML = `${calculateAverageRating(
          dogwalker.rating
        )} 
        <i class="rating-star fa-solid fa-star"></i>`;

        const idParagraph = document.createElement("p");
        idParagraph.textContent = dogwalker.id;
        idParagraph.classList.add("hidden");
        idParagraph.setAttribute("id", "walker-id");

        const acceptButton = document.createElement("button");
        acceptButton.textContent = "Accept";
        acceptButton.setAttribute("id", "submit");
        acceptButton.classList.add("walker-button");
        acceptButton.classList.add("walker-accept-button");
        acceptButton.onclick = function () {
          onClickAcceptButton(this);
        };

        const declineButton = document.createElement("button");
        declineButton.textContent = "Decline";
        declineButton.classList.add("walker-button");
        declineButton.classList.add("walker-decline-button");
        declineButton.onclick = function () {
          onClickDeclineButton(this);
        };

        detailDiv.appendChild(img);
        detailDiv.appendChild(nameParagraph);
        detailDiv.appendChild(ratingParagraph);
        dogwalkerCard.appendChild(idParagraph);
        buttonsDiv.appendChild(acceptButton);
        buttonsDiv.appendChild(declineButton);
        dogwalkerCard.appendChild(detailDiv);
        dogwalkerCard.appendChild(buttonsDiv);

        const delay = Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000;
        setTimeout(() => {
          availableDogwalkersDiv.appendChild(dogwalkerCard);
        }, delay);
      });
    })
    .catch((error) => {
      console.error("Error fetching dog walkers:", error);
    });
}

function getRandomDogWalkers(dogWalkers, count) {
  const shuffled = dogWalkers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function onInit() {
  window.addRequestToDom = addRequestToDom;
  window.onClickDeclineButton = onClickDeclineButton;
  window.onClickDeleteButton = onClickDeleteButton;
  window.onClickShowDogwalkerButton = onClickShowDogwalkerButton;
  window.onClickAcceptButton = onClickAcceptButton;
}
