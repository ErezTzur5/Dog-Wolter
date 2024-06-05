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
    <p>your location: ${data.currentLocation}</p>
    <p>when you want the dogwolter: ${data.currentTime}</p>
    <p>duration trip time: ${data.timeDuration}</p>
    `;
  });
}
