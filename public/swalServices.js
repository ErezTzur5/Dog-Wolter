let countdownDuration;

function showSucssesToast(msgTitle) {
  Swal.fire({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon: "success",
    title: `<p style="color: green">${msgTitle}`,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
      toast.addEventListener("click", () => Swal.close());
    },
    willClose: (toast) => {
      toast.style.transition = "opacity 20s";
      setTimeout(() => {
        toast.style.opacity = "0";
      }, 20000);
    },
  });
}

function showErrorToast(msgTitle) {
  Swal.fire({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon: "error",
    title: `<p style="color: red">${msgTitle}`,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
      toast.addEventListener("click", () => Swal.close());
    },
    willClose: (toast) => {
      toast.style.transition = "opacity 20s";
      setTimeout(() => {
        toast.style.opacity = "0";
      }, 20000);
    },
  });
}

function showToast() {
  Swal.fire({
    title: "<strong>HTML <u>Wolter</u></strong>",
    html: `
          You can use <b>bold text</b>,
          <a href="#">links</a>,
          and other HTML tags
        `,
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: `
          <i class="fa fa-thumbs-up"></i> Great!
        `,
    confirmButtonAriaLabel: "Thumbs up, great!",
    cancelButtonText: `
          <i class="fa fa-thumbs-down"></i>
        `,
    cancelButtonAriaLabel: "Thumbs down",
  });
}

async function arriveToast(requestURL, requestID) {
  try {
    const response = await axios.get(`${requestURL}/${requestID}`);
    const time = response.data.timeDuration;
    Swal.fire({
      title: `Your DogWolter Has Arrived! Now it's time for the walk...`,
      html: `
          <div id="custom-icon" style="font-size: 50px; cursor: pointer;">&#x1F436;</div>
          <div id="timeDuration">time left: ${time} minutes</div>
        `,
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    countdownDuration = time;
    updateCountdown();
  } catch (error) {
    console.error("There was an error making the request:", error);
  }
}

function updateCountdown() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("dogwalkerId");
  console.log(userId);
  const timeDiv = document.getElementById("timeDuration");
  countdownDuration--;
  timeDiv.textContent = `time left: ${countdownDuration} minutes`;
  if (countdownDuration > 0) {
    setTimeout(updateCountdown, 1000);
  } else {
    Swal.close();
    Swal.fire({
      title: `How would you rate your DogWolter?`,
      html: `
                  <span onclick="gfg(1)"
              class="star">★
        </span>
        <span onclick="gfg(2)"
              class="star">★
        </span>
        <span onclick="gfg(3)"
              class="star">★
        </span>
        <span onclick="gfg(4)"
              class="star">★
        </span>
        <span onclick="gfg(5)"
              class="star">★
        </span>

      <button onclick="updateRatingData('${userId.trim()}')">Confirm</button>

        `,
      showConfirmButton: false,
      allowOutsideClick: false,
    });
  }
}
export const swalService = {
  showErrorToast,
  showSucssesToast,
  showToast,
  arriveToast,
};
