document.addEventListener("DOMContentLoaded", function () {
  const dataURL = "http://localhost:8001/requests";
  const params = new URLSearchParams(window.location.search);
  const requestId = params.get("id");
  addRequestToDom(dataURL, requestId);
});

function addRequestToDom(URL, id) {
  const propertiesDiv = document.getElementById("requestProperties");
  axios.get(`${URL}/${id}`).then((response) => {
    const data = response.data;
    propertiesDiv.innerHTML = `
    <h3>your location:</h3>
    <p>${data.currentLocation}</p>
    <h3>when you want the dogwolter:</h3>
    <p>${data.currentTime}</p>
    <h3>duration trip time:</h3>
    <p> ${data.timeDuration}</p>
    <button onclick="editRequest(this)">edit your request</button>
    <button onclick="deleteRequest(this)">delete your request</button>
    `;
  });
}

function editRequest(svgElement) {
  const divElem = svgElement.parentNode;
  const SaveRequestButton = document.createElement("button");
  SaveRequestButton.textContent = "save your request";
  SaveRequestButton.onclick = function () {
    saveRequest(this);
  };
  divElem.replaceChild(SaveRequestButton, svgElement);
  const p = divElem.querySelectorAll("p");
  p.forEach((paragraph) => {
    const input = document.createElement("input");
    input.value = paragraph.textContent;
    divElem.replaceChild(input, paragraph);
  });
}

function saveRequest(svgElement) {
  const divElem = svgElement.parentNode;
  const inpts = divElem.querySelectorAll("input");
  const location = inpts[0].value;
  const time = inpts[1].value;
  const duration = inpts[2].value;
  console.log(location, time, duration);
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
    });
  } catch (err) {}
}

function updateData(location, time, duration) {
  const dataURL = "http://localhost:8001/requests";
  const params = new URLSearchParams(window.location.search);
  const requestId = params.get("id");
  const updatedRequest = {
    currentLocation: location,
    currentTime: time,
    timeDuration: duration,
  };
  try {
    axios.put(`${dataURL}/${requestId}`, updatedRequest);
    // success message
  } catch (err) {
    // error message
  }
}

function declineRequest(svgElement) {
  const dogwalkerCard = svgElement.parentNode;
  dogwalkerCard.remove();
  // success message
}

function deleteRequest() {
  const params = new URLSearchParams(window.location.search);
  const requestId = params.get("id");
  const dataURL = `http://localhost:8001/requests/${requestId}`;

  axios
    .delete(dataURL)
    .then((response) => {
      const newUrl = `http://127.0.0.1:5500/public/home/homePage.html`;
      window.location.href = newUrl;
      // success message
    })
    .catch((err) => {
      // error message
    });
}
