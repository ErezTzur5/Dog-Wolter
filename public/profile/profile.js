const editButton = document.getElementById("editButton");
const saveButton = document.getElementById("saveButton");
// const dogP = document.getElementById("dogName");

function editProfile(svgElement) {
  try {
    const divElem = svgElement.parentNode.parentNode;
    const paragraphs = divElem.querySelectorAll("p");
    paragraphs.forEach((paragraph) => {
      const input = document.createElement("input");
      input.value = paragraph.textContent;
      paragraph.replaceWith(input);
      editButton.style.display = "none";
      saveButton.style.display = "block";
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
      editButton.style.display = "block";
      saveButton.style.display = "none";
      // dogP.classList.add("dog-name");
    });
  } catch (error) {
    // error message
  }
}
