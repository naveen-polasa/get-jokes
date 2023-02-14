const btn = document.querySelector(".btn");
const result = document.querySelector(".result");
const star = document.querySelector(".star");
const copy = document.querySelector(".copy");
const alert1 = document.querySelector(".alert1");
const alert2 = document.querySelector(".alert2");
const speak = document.querySelector(".speak");
const jokesList = document.querySelector(".jokes-list");
const jokesHeading = document.querySelector(".jokes-heading");
const jokesContainer = document.querySelector(".jokes-container");
const clearList = document.querySelector(".clear-list");
const addBtn = document.querySelector(".add-btn");
const input = document.querySelector(".input");

const url = "https://icanhazdadjoke.com/";

window.addEventListener("DOMContentLoaded", setupItems);

btn.addEventListener("click", () => {
  star.style.display = "none";
  copy.style.display = "none";
  speak.style.display = "none";
  alert1.style.display = "none";
  fetchJoke(url);
});

star.addEventListener("mouseenter", () => {
  star.classList.add("fa-solid");
});

star.addEventListener("mouseout", () => {
  star.classList.remove("fa-solid");
});

star.addEventListener("click", () => {
  showAlert(alert1, "Added to Favorites");
  addToLocalStorage(result.innerText);
  setupItems();
});

copy.addEventListener("mouseenter", () => {
  copy.classList.add("fa-solid");
});

copy.addEventListener("mouseout", () => {
  copy.classList.remove("fa-solid");
});

copy.addEventListener("click", () => {
  showAlert(alert1, "Joke Copied");
  copyFunc(result.innerText);
});

clearList.addEventListener("click", () => {
  clearLocalStorage();
});

speak.addEventListener("click", () => {
  textToSpeech(result.textContent);
});

addBtn.addEventListener("click", () => {
  input.classList.toggle("invisible");
  input.focus();
  if (!input.value) return;
  if (input.value.length < 22) {
    showAlert(alert2, "Please Add minimum of 24 characters");
    input.value = "";
    return;
  }
  if (checkItem(input.value, alert2)) {
    input.value = "";
    return;
  }
  addToLocalStorage(input.value);
  setupItems();
  showAlert(alert2, "Added Successfully");
  input.value = "";
});

const fetchJoke = async (url) => {
  result.textContent = "Loading...";
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "User-Agent": "Learning App",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong...");
    }
    const data = await response.json();
    result.textContent = data.joke;
    star.style.display = "block";
    copy.style.display = "block";
    speak.style.display = "block";
    alert1.style.display = "block";
  } catch (error) {
    result.textContent = "There was an error...";
    console.log(error);
  }
};

function removeItem(e) {
  const el =
    e.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
  editLocalStorage(el);
}
function copyItem(e) {
  const el = e.target.parentElement.parentElement.previousElementSibling;
  copyFunc(el.innerText);
}

function copyFunc(text) {
  navigator.clipboard.writeText(text);
}

function showAlert(element, alertText) {
  element.innerText = alertText;
  setTimeout(() => {
    element.innerText = "Options";
  }, 2000);
}

function textSpeech(e) {
  const el = e.target.parentElement.parentElement.previousElementSibling;
  textToSpeech(el.innerText);
}

function textToSpeech(text) {
  const synth = window.speechSynthesis;
  synth.cancel();
  const speech = new SpeechSynthesisUtterance(text);
  synth.speak(speech);
}

function getLocalStorage() {
  return localStorage.getItem("jokes")
    ? JSON.parse(localStorage.getItem("jokes"))
    : [];
}

function clearLocalStorage() {
  localStorage.removeItem("jokes");
  setupItems();
}

function editLocalStorage(id) {
  const localData = getLocalStorage();
  const newData = localData.filter((joke) => {
    if (joke.id != id) {
      return joke;
    }
  });
  localStorage.setItem("jokes", JSON.stringify(newData));
  setupItems();
}

function checkItem(joke, alert) {
  const localData = getLocalStorage();
  for (let j of localData) {
    if (j.joke === joke) {
      showAlert(alert, "Already in Favorites");
      return true;
    }
  }
}

const addToLocalStorage = (joke) => {
  const jokeObj = { id: Date.now(), joke };
  let jokes = getLocalStorage();
  if (checkItem(joke, alert1)) return;
  jokes.push(jokeObj);
  localStorage.setItem("jokes", JSON.stringify(jokes));
};

function setupItems() {
  const jokesData = getLocalStorage();

  jokesHeading.innerText = jokesData.length > 0 ? "Your Favorites List" : "";
  clearList.style.display = jokesData.length > 0 ? "block" : "none";
  addBtn.style.display = jokesData.length > 0 ? "block" : "none";
  jokesData.length == 0 && input.classList.add("invisible");
  jokesData.length == 0
    ? alert2.classList.add("invisible")
    : alert2.classList.remove("invisible");
  jokesData.length > 0
    ? jokesContainer.classList.add("border-[.3px]")
    : jokesContainer.classList.remove("border-[.3px]");

  if (jokesData.length >= 0) {
    jokesList.innerText = "";
    jokesData.forEach((item) => {
      createItems(item.joke, item.id);
    });
  }
}

function createItems(joke, id) {
  const element = document.createElement("article");
  const attr = document.createAttribute("data-id");
  element.classList.add("mt-2");
  attr.value = id;
  element.setAttributeNode(attr);

  element.innerHTML = `<div class='flex justify-between items-center p-2 border-[.3px] rounded-xl border-zinc-500'>
        <p class='lg:text-xl m-2 mx-auto px-3 text-center text-white'>${joke}</p>
        <div class='flex-col'>
        <div class="flex items-center border-[.3px] rounded-xl border-zinc-400 ">
                    <i class="fa-regular fa-clipboard fa-xl mx-3 mb-1 mt-2 copy-${id} hover:scale-110 text-indigo-400" title="COPY"></i>
                    <i class=" fa-solid fa-volume-high fa-xl mx-3 mb-1 mt-2 hover:scale-110 text-teal-200 speak1" title="SPEAK"></i>
                    <i class="fa-solid fa-xmark fa-2x text-red-600 mx-3 mb-1 mt-2 remove hover:scale-125 duration-300" title="REMOVE"></i>
                    </div>
        <p class="pt-1 h-9 text-white border-[.3px] rounded-xl border-zinc-400 mt-1">Options</p>
        </div>
        </div>`;

  jokesList.appendChild(element);

  const copy = document.querySelector(`.copy-${id}`);

  copy.addEventListener("click", (e) => {
    copyItem(e);
    const alert3 = e.target.parentElement.nextElementSibling;
    showAlert(alert3, "Joke Copied");
  });

  const speak1 = [...document.querySelectorAll(".speak1")];
  speak1.forEach((item) => {
    item.addEventListener("click", textSpeech);
  });

  const remove = [...document.querySelectorAll(".remove")];
  remove.forEach((btn) => {
    btn.addEventListener("click", removeItem);
  });
}

fetchJoke(url);
