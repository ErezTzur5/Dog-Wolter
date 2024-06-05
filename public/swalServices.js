function showSucssesToast(msgTitle) {
  Swal.fire({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    icon: "success",
    title: msgTitle,
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
    timer: 1500,
    timerProgressBar: true,
    icon: "error",
    title: msgTitle,
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
    icon: "info",
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

export const swalService = {
  showErrorToast,
  showSucssesToast,
  showToast,
};
