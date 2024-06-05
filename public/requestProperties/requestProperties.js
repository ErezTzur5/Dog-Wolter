document.addEventListener("DOMContentLoaded", function () {
  // Get the URL search parameters
  const params = new URLSearchParams(window.location.search);

  // Get the specific parameter 'id'
  const userId = params.get("id");

  console.log(userId);
});
