const URL = "http://localhost:8001";
let autocomplete;

function setDefaultTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const currentTime = `${hours}:${minutes}`;
  document.getElementById("time").value = currentTime;
}

window.onload = function () {
  setDefaultTime();
  initAutocomplete();
};

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("current-location"),
    {
      types: ["geocode"],
    }
  );
}

document
  .getElementById("createNewRequest")
  .addEventListener("submit", (evn) => {
    evn.preventDefault();
    const timeDurationEl = document.getElementById("time-duration").value;
    const currentTime = document.getElementById("time").value;
    const currentLocation = document.getElementById("current-location").value;
    const newRequest = {
      currentLocation: currentLocation,
      currentTime: currentTime,
      timeDuration: timeDurationEl,
    };
    axios
      .post(`${URL}/requests`, newRequest)
      .then((response) => {
        const requestId = response.data.id;
        const newUrl = `http://127.0.0.1:5500/public/requestProperties/requestProperties.html?id=${encodeURIComponent(
          requestId
        )}`;
        window.location.href = newUrl;
      })
      .catch((err) => {
        //error message
      });
  });

document.getElementById("time").addEventListener("click", function () {
  this.showPicker();
});
