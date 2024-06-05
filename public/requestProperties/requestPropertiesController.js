import {
  addRequestToDom,
  updateData,
  deleteRequest,
  showDogwalkerProperties,
  showToast,
} from "./requestPropertiesService.js";

document.addEventListener("DOMContentLoaded", async function () {
  const dataURL = "http://localhost:8001/requests";
  const params = new URLSearchParams(window.location.search);
  const requestId = params.get("id");
  const data = await addRequestToDom(dataURL, requestId);
  const propertiesDiv = document.getElementById("requestProperties");
  propertiesDiv.innerHTML = `
  <h3>your location:</h3>
  <p>${data.currentLocation}</p>
  <h3>when you want the dogwolter:</h3>
  <p>${data.currentTime}</p>
  <h3>duration trip time:</h3>
  <p> ${data.timeDuration}</p>
  <button onclick="onClickEditButton(this)">edit your request</button>
  <button onclick="onClickDeleteButton(this)">delete your request</button>
  `;
});

window.onload = onInit();

function onClickEditButton(svgElement) {
  const divElem = svgElement.parentNode;
  const SaveRequestButton = document.createElement("button");
  SaveRequestButton.textContent = "save your request";
  SaveRequestButton.onclick = function () {
    onClickSaveButton(this);
  };
  divElem.replaceChild(SaveRequestButton, svgElement);
  const p = divElem.querySelectorAll("p");
  p.forEach((paragraph) => {
    const input = document.createElement("input");
    input.value = paragraph.textContent;
    divElem.replaceChild(input, paragraph);
  });
}

function onClickSaveButton(svgElement) {
  const divElem = svgElement.parentNode;
  const inpts = divElem.querySelectorAll("input");
  const location = inpts[0].value;
  const time = inpts[1].value;
  const duration = inpts[2].value;
  try {
    updateData(location, time, duration);
    const EditRequestButton = document.createElement("button");
    EditRequestButton.textContent = "edit your request";
    EditRequestButton.onclick = editRequest;
    divElem.replaceChild(EditRequestButton, svgElement);
    const inputs = divElem.querySelectorAll("input");
    inputs.forEach((input) => {
      const p = document.createElement("p");
      p.textContent = input.value;
      divElem.replaceChild(p, input);
      // success message
    });
  } catch (e) {
    // error message
  }
}

function onClickDeclineButton(svgElement) {
  try {
    const dogwalkerCard = svgElement.parentNode;
    dogwalkerCard.remove();
    // success message
  } catch (e) {
    // error message
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
      propetries.rating
    );
  } catch (e) {
    // error message
  }
}

function onClickAcceptButton(svgElement) {
  const divElem = svgElement.parentNode;
  const dogwalkerId = divElem.querySelector("#walker-id").textContent;
  const params = new URLSearchParams(window.location.search);
  const requestId = params.get("id");
  const newUrl = `http://127.0.0.1:5500/public/onWalk/onWalk.html?id=${encodeURIComponent(
    requestId
  )}&dogwalkerId=${encodeURIComponent(dogwalkerId)}`;

  window.location.href = newUrl;
}

function onInit() {
  window.addRequestToDom = addRequestToDom;
  window.onClickEditButton = onClickEditButton;
  window.onClickSaveButton = onClickSaveButton;
  window.onClickDeclineButton = onClickDeclineButton;
  window.onClickDeleteButton = onClickDeleteButton;
  window.onClickShowDogwalkerButton = onClickShowDogwalkerButton;
  window.onClickAcceptButton = onClickAcceptButton;
}
