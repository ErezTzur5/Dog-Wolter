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
    <p> ${data.timeDuration} hours</p>
    <button onclick="editRequest(this)">edit your request</button>
    <button onclick="deleteRequest(this)">delete your request</button>
    `;
  });
}

function editRequest(svgElement) {
  const divElem = svgElement.parentNode;
  const SaveRequestButton = document.createElement("button");
  SaveRequestButton.textContent = "save your request";
  divElem.replaceChild(SaveRequestButton, svgElement);
  const p = divElem.querySelectorAll("p");
  p.forEach((paragraph) => {
    const input = document.createElement("input");
    input.value = paragraph.textContent;
    divElem.replaceChild(input, paragraph);
  });
}
