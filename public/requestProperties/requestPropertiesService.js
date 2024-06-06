export function addRequestToDom(URL, id) {
  return axios.get(`${URL}/${id}`).then((response) => {
    const data = response.data;
    return data;
  });
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
          <img class = "popup-pic" src="${img}" alt="dogWalkerPic"">
          <h1 class = "popup-header"><b>${dogwalkerName}</b></h1>
          <p class = "popup-phone-number"><b>Phone Number:</b> ${phone}</p>
          <p class = "popup-address"><b>Address:</b> ${address}</p>
          <p class = "popup-description"><b>Description:</b> ${description}</p>
          <p class = "popup-rating"><b>Rating:</b> ${rating}</p>
        `,
    showCloseButton: false,
    showCancelButton: false,
    focusConfirm: false,
    confirmButtonText: `
          Close
        `,
    confirmButtonAriaLabel: "Thumbs up, great!",
    cancelButtonText: `
          <i class="fa fa-thumbs-down"></i>
        `,
    cancelButtonAriaLabel: "Thumbs down",
  });
}

export function showDogwalkerProperties(currentDogwalker) {
  const walkerId = currentDogwalker.id;
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

export async function updateRatingData(userRating, dogwalkerId) {
  const dataURL = "http://localhost:8001/dogWalkers";
  const dogwalkersResponse = await axios.get(`${dataURL}/${dogwalkerId}`);
  const ratings = dogwalkersResponse.data.rating;
  console.log(ratings);
}
