export function addRequestToDom(URL, id) {
  return axios.get(`${URL}/${id}`).then((response) => {
    const data = response.data;
    return data;
  });
}

export function updateData(location, time, duration) {
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

export function deleteRequest() {
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

export function showToast(
  img,
  dogwalkerName,
  phone,
  address,
  description,
  rating
) {
  Swal.fire({
    html: `
          <img src="${img}" alt="dogWalkerPic" style="width: 200px; height: 200px; border-radius: 50%; margin-left: 27%">
          <h1><b>${dogwalkerName}</b></h1>
          <br></br>
          <p><b>Phone Number:</b> ${phone}</p>
          <p><b>Address:</b> ${address}</p>
          <p><b>Description:</b> ${description}</p>
          <p><b>Rating:</b> ${rating}</p>
        `,
    showCloseButton: false,
    showCancelButton: false,
    focusConfirm: false,
    confirmButtonText: `
          <i class="fa fa-thumbs-up"></i> Close
        `,
    confirmButtonAriaLabel: "Thumbs up, great!",
    cancelButtonText: `
          <i class="fa fa-thumbs-down"></i>
        `,
    cancelButtonAriaLabel: "Thumbs down",
  });
}

export function showDogwalkerProperties(svgElement) {
  const dogwalkerCard = svgElement.parentNode;
  const walkerId = dogwalkerCard.querySelector("#walker-id").textContent;
  const dataURL = "http://localhost:8001/dogWalkers";
  return axios
    .get(`${dataURL}/${walkerId}`)
    .then((response) => {
      const data = response.data;
      const img = data.img;
      const dogwalkerName = data.name;
      const phone = data.phoneNumber;
      const address = data.address;
      const description = data.description;
      const rating = data.rating;
      return { img, dogwalkerName, phone, address, description, rating };
    })
    .catch((error) => {
      // error message
    });
}
