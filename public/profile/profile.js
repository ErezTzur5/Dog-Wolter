const dogCard = document.getElementById("dogcard");
const userURL = "http://localhost:8001/users";

async function displayProfile() {
  try {
    const response = await axios.get(userURL);
    const data = response.data[0];
    const img = data.image;
    const name = data.name;
    const age = data.age;
    const breed = data.breed;
    const hobbies = data.hobbies;
    const treats = data.treats;
    const skills = data.skills;
    const health = data.health;
    dogCard.innerHTML = `
      <button class="save-btn" id="saveButton" onclick="saveProfile(this)"></button>
      <button class="edit-btn" id="editButton" onclick="editProfile(this)"></button>
      <div class="top-card">
        <img src="${img}" alt="dog" class="dog-img" />
      </div>
      <p class="dog-name" id="dogName">${name}</p>
      <h3>Age:</h3>
      <p>${age}</p>
      <h3>Breed:</h3>
      <p>${breed}</p>
      <h3>Hobbies:</h3>
      <p>${hobbies}</p>
      <h3>Favorite treats:</h3>
      <p>${treats}</p>
      <h3>Special skills:</h3>
      <p>${skills}</p>
      <h3>Health notes:</h3>
      <p>${health}</p>
    `;
  } catch (error) {
    // error message
  }
}

displayProfile();

function editProfile(svgElement) {
  const editButton = document.getElementById("editButton");
  const saveButton = document.getElementById("saveButton");
  try {
    const divElem = svgElement.parentNode;
    const paragraphs = divElem.querySelectorAll("p");
    paragraphs.forEach((paragraph) => {
      const input = document.createElement("input");
      input.value = paragraph.textContent;
      divElem.replaceChild(input, paragraph);
    });
    editButton.style.display = "none";
    saveButton.style.display = "block";
  } catch (error) {
    // error message
  }
}

function saveProfile(svgElement) {
  const editButton = document.getElementById("editButton");
  const saveButton = document.getElementById("saveButton");
  const divElem = svgElement.parentNode;
  const updateElems = divElem.querySelectorAll("input");
  const name = updateElems[0].value;
  const age = updateElems[1].value;
  const breed = updateElems[2].value;
  const hobbies = updateElems[3].value;
  const treats = updateElems[4].value;
  const skills = updateElems[5].value;
  const health = updateElems[6].value;
  try {
    const divElem = svgElement.parentNode.parentNode;
    const inputs = divElem.querySelectorAll("input");
    inputs.forEach((input) => {
      const p = document.createElement("p");
      p.textContent = input.value;
      input.replaceWith(p);
    });
    editButton.style.display = "block";
    saveButton.style.display = "none";

    const itemToUpdate = {
      name,
      age,
      breed,
      hobbies,
      treats,
      skills,
      health,
    };

    axios.patch(`${userURL}/1f78`, itemToUpdate);
  } catch (error) {
    // error message
  }
}
