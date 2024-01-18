"use strict";

const input = document.getElementById("search");
const dropdownList = document.getElementById("dropdown-list");
const movieSuggest = document.getElementById("movieSuggest");
const clearBtn = document.getElementById("clearBtn");
const diceBtn = document.getElementById("diceBtn");
const filmEle = document.getElementById("movieWrapper");

let filmTitle = "";
let filmYear = "";
let filmImg = "";

// +++ API +++

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODdkOGE1YzViZWU3Njg1YzU5MWI5OWU1MGM2NmFhNyIsInN1YiI6IjY1NGZiOTc1NDFhNTYxMzM2ZDg4MWY1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nRgZT0MEGk5Cv6OwExKNZSUq4a2wAF-8exzxTB17adU",
  },
};

// find movie function

let findMovieTitle, findMovieYear, findMovieImg, filmID;

async function findMovie() {
  try {
    const searchTerm = input.value;
    const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US&page=1`;
    const response = await fetch(searchUrl, options);
    const result = await response.json();
    result.results.slice(0, 5);

    dropdownList.innerHTML = "";

    for (let i = 0; i < 5 && i < result.results.length; i++) {
      const obj = result.results[i];
      filmTitle = obj.title;
      filmYear = obj.release_date.slice(0, 4);
      filmImg = obj.poster_path;
      filmID = obj.id;

      const listItem = document.createElement("li");
      listItem.classList.add("movieSuggest");
      listItem.innerHTML = `<img style="max-height:100px;" src="https://image.tmdb.org/t/p/w200/${filmImg}" alt=""><div>${filmTitle}, ${filmYear}</div>
            <p id="movieID">${filmID}</p>`;

      dropdownList.appendChild(listItem);
    }
  } catch (error) {
    console.error(error);
  }
}

const addedMovieIds = new Set();

document.addEventListener("click", function (event) {
  const clickedItem = event.target.closest(".movieSuggest");
  if (clickedItem) {
    const clickedTitle = clickedItem
      .querySelector("div")
      .textContent.split(",")[0]
      .trim();
    const clickedYear = clickedItem
      .querySelector("div")
      .textContent.split(",")[1]
      .slice(1, 5);
    const clickedImg = clickedItem.querySelector("img").src;
    const clickedID = clickedItem.querySelector("p").textContent;

    if (!document.getElementById(clickedID)) {
      pushMovie(clickedTitle, clickedYear, clickedImg, clickedID);
    } else {
      const movieElementSingle = document.getElementById(clickedID);
      movieElementSingle.classList.add("alreadyAdded");
      setTimeout(function () {
        movieElementSingle.classList.remove("alreadyAdded");
      }, 500);
    }
  }
});

async function pushMovie(title, year, img, id) {
  const existingMovie = document.getElementById(id);

  // --- check if the element already existsKlicken, um Alternative zu verwenden ---
  if (!existingMovie) {
    const movieElement = document.createElement("div");

    movieElement.classList.add("movie");
    movieElement.id = id;
    movieElement.innerHTML = `<div class="remove-movie-button-wrapper"><button class="remove-movie-button">&#10006;</button></div>
            <img id="moviePic" class="movie-pic" src="${img}" alt="">
            <div class="movie-title">${title}</div>
            <div class="movie-year">(${year})</div>`;

    // --- add the element with animation ---
    movieElement.classList.add("fadeInAnimation");
    filmEle.insertAdjacentElement("beforeend", movieElement);

    // --- remove the animation ---
    setTimeout(function () {
      movieElement.classList.remove("fadeInAnimation");
    }, 200);

    // --- add an event listener for removing ---
    movieElement
      .querySelector(".remove-movie-button")
      .addEventListener("click", function () {
        movieElement.classList.add("fadeOutAnimation");
        setTimeout(function () {
          movieElement.remove();
        }, 200);
      });
  } else {
    console.log("Element bereits vorhanden.");
  }

  // --- delete movie from List ----
  function removeClick(event) {
    const clearSingleMovieBtn = event.target.closest(".remove-movie-button");
    if (clearSingleMovieBtn) {
      const parentElement = clearSingleMovieBtn.closest(".movie");
      parentElement.classList.add("fadeOutAnimation");
      setTimeout(function () {
        if (parentElement) {
          parentElement.remove();
        }
      }, 200);
    }
  }

  document.addEventListener("dblclick", function (event) {
    removeClick(event);
  });

  document.addEventListener("click", function (event) {
    removeClick(event);
  });
}

// CLEAR-ALL BUTTON

clearBtn.addEventListener("click", async function () {
  filmEle.innerHTML = "";
});

// DICE FUNCTION

function getRandomMovieElement() {
  const movieElements = document.querySelectorAll(".movie");

  if (movieElements.length > 0) {
    const randomIndex = Math.floor(Math.random() * movieElements.length);
    const randomMovieElement = movieElements[randomIndex];

    const filmTitle =
      randomMovieElement.querySelector(".movie-title").textContent;
    const filmYear =
      randomMovieElement.querySelector(".movie-year").textContent;
    const filmImg = randomMovieElement.querySelector("img").src;

    console.log("Zufälliges Movie-Element:", filmTitle, filmYear, filmImg);

    // --- call function and transfer data ---
    addBackdrop(filmTitle, filmYear, filmImg).then(() => {
      console.log("Backdrop hinzugefügt.");
    });
  } else {
    console.log("Keine Movie-Elemente vorhanden.");
  }
}

// Dicer click

diceBtn.addEventListener("click", function () {
  getRandomMovieElement();
});

// Backdrop with data parameters and Promise

function addBackdrop(filmTitle, filmYear, filmImg) {
  return new Promise((resolve) => {
    const backdropElement = document.createElement("div");
    backdropElement.classList.add("backdrop");
    const diceElement = document.createElement("div");
    diceElement.classList.add("dice-element");
    backdropElement.appendChild(diceElement);

    const searchForStream = `https://www.google.de/search?q=${filmTitle}+${filmYear}+stream&sca_esv=586607062&sxsrf=AM9HkKlPY0c-orwUkYdBq34xkj4b8FXqOA%3A1701355108688&source=hp&ei=ZJ5oZYaZKKuVxc8PoaC2sAg&iflsig=AO6bgOgAAAAAZWisdPK5StbuXiRaxuJLGt6ypkC8JX3u&ved=0ahUKEwiG243X-euCAxWrSvEDHSGQDYYQ4dUDCAw&uact=5&oq=saw+2+%282005%29+stream&gs_lp=Egdnd3Mtd2l6IhNzYXcgMiAoMjAwNSkgc3RyZWFtSNuhAlCyKFi4nAJwBngAkAEAmAGZAaAB3Q6qAQQyMS4zuAEDyAEA-AEBqAIKwgIHECMY6gIYJ8ICBBAjGCfCAgoQIxiABBiKBRgnwgILEAAYgAQYsQMYgwHCAgoQABiABBiKBRhDwgIREC4YgAQYsQMYgwEYxwEY0QPCAgoQLhiABBiKBRhDwgIQEC4YgAQYigUYxwEY0QMYQ8ICFhAuGIAEGIoFGLEDGIMBGMcBGNEDGEPCAgsQLhiABBixAxiDAcICCxAuGIMBGLEDGIAEwgIIEC4YsQMYgATCAgsQLhiABBjHARivAcICBRAAGIAEwgIFEC4YgATCAggQLhjUAhiABMICCBAuGIAEGMsBwgIIEAAYgAQYywHCAgYQABgWGB7CAggQABgWGB4YD8ICCBAhGBYYHhgd&sclient=gws-wiz`;

    // --- add the background element to the body ---
    document.body.appendChild(backdropElement);
    diceElement.innerHTML = `
        <div class="your-random-movie">Congratulations! Your movie is:</div>
            <div class="random-movie-wrapper">
            <a href="${searchForStream}" target="_blank"><img id="moviePicResult" class="movie-pic-result" src="https://image.tmdb.org/t/p/w200/${filmImg}"></a>
        <div class="movie-title-dice">${filmTitle}</div>
        </div>
        <div class="search-stream-wrapper">
        <a href="${searchForStream}" target="_blank"><button>search for stream</button></a>
        </div>
        `;

    // remove backdrop
    backdropElement.addEventListener("click", function (event) {
      const isButtonClick =
        event.target.tagName === "BUTTON" || event.target.closest("button");
      const isNameClick = event.target.closest(".movie-title-dice");
      const isImgClick = event.target.closest("#moviePicResult");
      if (
        !isImgClick &&
        !isNameClick &&
        !isButtonClick &&
        event.target !== diceElement &&
        event.target.innerHTML !== diceElement.innerHTML
      ) {
        backdropElement.remove();
        filmTitle = "";
        filmYear = "";
        filmImg = "";
        resolve();
      }
    });
  });
}

// Arrowkeys use

let selectedIndex = -1;
let clickedTitle = "";
let clickedYear = "";
let clickedImg = "";
let clickedID = "";

document.addEventListener("keydown", function (event) {
  const listItems = dropdownList.querySelectorAll("li");

  if (event.key === "ArrowDown") {
    selectedIndex = (selectedIndex + 1) % listItems.length;
  } else if (event.key === "ArrowUp") {
    selectedIndex = (selectedIndex - 1 + listItems.length) % listItems.length;
  } else {
    return; // if no arrow using, end the function
  }

  // remove previously added class for active selection
  listItems.forEach((item) => item.classList.remove("active-per-arrow"));

  // set the class for the selected option
  listItems[selectedIndex].classList.add("active-per-arrow");
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && selectedIndex !== -1) {
    event.preventDefault(); // prevent the default behavior of the Enter key

    const selectedElement = dropdownList.querySelectorAll("li")[selectedIndex];
    // set values for the selected option
    clickedTitle = selectedElement
      .querySelector("div")
      .textContent.split(",")[0]
      .trim();
    clickedYear = selectedElement
      .querySelector("div")
      .textContent.split(",")[1]
      .slice(1, 5);
    clickedImg = selectedElement.querySelector("img").src;
    clickedID = selectedElement.querySelector("p").textContent;

    // execute the desired action for the selected option
    if (!document.getElementById(clickedID)) {
      pushMovie(clickedTitle, clickedYear, clickedImg, clickedID);
    } else {
      const movieElementSingle = document.getElementById(clickedID);
      movieElementSingle.classList.add("alreadyAdded");
      setTimeout(function () {
        movieElementSingle.classList.remove("alreadyAdded");
      }, 500);
    }
  }
});

dropdownList.addEventListener("mouseover", function (event) {
  const hoveredItem = event.target.closest("li");
  if (hoveredItem) {
    // reset the selectedIndex when the mouse hovers over a li
    selectedIndex = -1;
    // remove class for active selection
    dropdownList
      .querySelectorAll("li")
      .forEach((item) => item.classList.remove("active-per-arrow"));
  }
});
