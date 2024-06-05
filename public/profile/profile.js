const editButton = document.getElementById("editButton");
const saveButton = document.getElementById("saveButton");

function editProfile(svgElement) {
  try {
    const divElem = svgElement.parentNode.parentNode;
    const paragraphs = divElem.querySelectorAll("p");
    paragraphs.forEach((paragraph) => {
      const input = document.createElement("input");
      input.value = paragraph.textContent;
      paragraph.replaceWith(input);
      editButton.classList.add("hidden");
      saveButton.classList.remove("hidden");
    });
  } catch (error) {
    // error message
  }
}

function saveProfile(svgElement) {
  try {
    const divElem = svgElement.parentNode.parentNode;
    const inputs = divElem.querySelectorAll("input");
    inputs.forEach((input) => {
      const p = document.createElement("p");
      p.textContent = input.value;
      input.replaceWith(p);
      editButton.classList.remove("hidden");
      saveButton.classList.add("hidden");
    });
  } catch (error) {
    // error message
  }
}
