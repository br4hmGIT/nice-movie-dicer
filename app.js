'use strict';

const input = document.getElementById('search');
const dropdownList = document.getElementById('dropdown-list');
const movieSuggest = document.getElementById('movieSuggest');
const clearBtn = document.getElementById('clearBtn');
const diceBtn = document.getElementById('diceBtn');
const filmEle = document.getElementById('movieWrapper');

let filmTitle = '';
let filmYear = '';
let filmImg = '';

// API
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODdkOGE1YzViZWU3Njg1YzU5MWI5OWU1MGM2NmFhNyIsInN1YiI6IjY1NGZiOTc1NDFhNTYxMzM2ZDg4MWY1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nRgZT0MEGk5Cv6OwExKNZSUq4a2wAF-8exzxTB17adU'
    }
};

let findMovieTitle, findMovieYear, findMovieImg, filmID;

async function findMovie() {
    try {
        const searchTerm = input.value;
        const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US&page=1`;
        const response = await fetch(searchUrl, options);

        console.log('Das ist meine Response: ' + response);

        const result = await response.json();
        result.results.slice(0, 5);

        console.log('Das Result: ');
        console.log(result);

        dropdownList.innerHTML = '';

        for (let i = 0; i < 5 && i < result.results.length; i++) {
            const obj = result.results[i];
            filmTitle = obj.title;
            filmYear = obj.release_date.slice(0, 4);
            filmImg = obj.poster_path;
            filmID = obj.id;

            const listItem = document.createElement('li');
            listItem.classList.add('movieSuggest'); // Verwenden Sie eine Klasse statt einer ID
            listItem.innerHTML = `<img style="max-height:100px;" src="https://image.tmdb.org/t/p/w200/${filmImg}" alt=""><div>${filmTitle}, ${filmYear}</div>
            <p id="movieID">${filmID}</p>`;

            dropdownList.appendChild(listItem);
        }
    } catch (error) {
        console.error(error);
    }
}

const addedMovieIds = new Set();

document.addEventListener('click', function (event) {
    const clickedItem = event.target.closest('.movieSuggest');
    if (clickedItem) {
        const clickedTitle = clickedItem.querySelector('div').textContent.split(',')[0].trim();
        const clickedYear = clickedItem.querySelector('div').textContent.split(',')[1].slice(1, 5);
        const clickedImg = clickedItem.querySelector('img').src;
        const clickedID = clickedItem.querySelector('p').textContent;

        if (!document.getElementById(clickedID)) {
            pushMovie(clickedTitle, clickedYear, clickedImg, clickedID);
        } else {
            const movieElementSingle = document.getElementById(clickedID);
            movieElementSingle.classList.add('alreadyAdded');
            setTimeout(function () {
                movieElementSingle.classList.remove('alreadyAdded');
            }, 500);
        }
    }
});

async function pushMovie(title, year, img, id) {
    const previousContent = filmEle.innerHTML;

    const movieElement = document.createElement('div');

    movieElement.classList.add('movie');

    movieElement.id = id;
    movieElement.innerHTML = `<div class="remove-movie-button-wrapper"><button class="remove-movie-button">&#10006;</button></div>
        <img id="moviePic" src="${img}" alt="">
        <div class="movie-title">${title}</div>
        <div class="movie-year">(${year})</div>`;

    movieElement.classList.add('fadeInAnimation');

    filmEle.insertAdjacentHTML('beforeend', movieElement.outerHTML);

    setTimeout(function () {
        movieElement.classList.remove('fadeInAnimation');
    }, 200);

    function removeClick(event) {
        const clearSingleMovieBtn = event.target.closest('.remove-movie-button');
        if (clearSingleMovieBtn) {
            const parentElement = clearSingleMovieBtn.closest('.movie');
            parentElement.classList.add('fadeOutAnimation');
            setTimeout(function () {
                if (parentElement) {
                    parentElement.remove();
                }
            }, 200);
        }
    }

    document.addEventListener('dblclick', function (event) {
        removeClick(event);
    });

    document.addEventListener('click', function (event) {
        removeClick(event);
    });
}

// CLEAR-ALL BUTTON

clearBtn.addEventListener('click', async function () {
    setTimeout(function () {
        filmEle.innerHTML = '';
    }, 200);
});

// DICE FUNCTION

function getRandomMovieElement() {
    const movieElements = document.querySelectorAll('.movie');
    
    if (movieElements.length > 0) {
        const randomIndex = Math.floor(Math.random() * movieElements.length);
        const randomMovieElement = movieElements[randomIndex];

        const filmTitle = randomMovieElement.querySelector('.movie-title').textContent;
        const filmYear = randomMovieElement.querySelector('.movie-year').textContent;
        const filmImg = randomMovieElement.querySelector('img').src;

        console.log('Zufälliges Movie-Element:', filmTitle, filmYear, filmImg);

        // Rufe die Funktion auf und übergebe die Daten
        addBackdrop(filmTitle, filmYear, filmImg).then(() => {
            console.log('Backdrop hinzugefügt.');
        });
    } else {
        console.log('Keine Movie-Elemente vorhanden.');
    }
}

diceBtn.addEventListener('click', function () {
    getRandomMovieElement();
});

// Backdrop mit Daten-Parametern und Promise
function addBackdrop(filmTitle, filmYear, filmImg) {
    return new Promise((resolve) => {
        // Erstelle ein neues div-Element für den Hintergrund
        const backdropElement = document.createElement('div');

        backdropElement.classList.add('backdrop'); // Füge eine Klasse hinzu, um das Styling zu definieren
        const diceElement = document.createElement('div');
        diceElement.classList.add('dice-element');
        backdropElement.appendChild(diceElement);

        // Füge das Hintergrundelement zum Body hinzu
        document.body.appendChild(backdropElement);
        diceElement.innerHTML = `
        <div class="your-random-movie">Congratulations! Your movie is</div>
        <div class="random-movie-wrapper">
        <img id="moviePicResult" src="https://image.tmdb.org/t/p/w200/${filmImg}" alt="">
        <div class="movie-title-dice">${filmTitle}</div>
        </div>
        `;

        // Beispiel für das Styling des Hintergrundelements (ersetze dies durch dein eigenes Styling)

        // Hier kannst du zusätzliche Aktionen ausführen, wenn das Hintergrundelement hinzugefügt wird
        console.log('Backdrop wurde hinzugefügt.');

        // Backdrop entfernen
        backdropElement.addEventListener('click', function () {
            backdropElement.remove();
            filmTitle = '';
            filmYear = '';
            filmImg = '';
            resolve(); // Löse das Promise, wenn die Operation abgeschlossen ist
        });
    });
}










// Arrowkeys use


let selectedIndex = -1;
let clickedTitle = '';
let clickedYear = '';
let clickedImg = '';
let clickedID = '';

document.addEventListener('keydown', function (event) {
    

    const listItems = dropdownList.querySelectorAll('li');

    if (event.key === 'ArrowDown') {
        // Nach unten navigieren
        selectedIndex = (selectedIndex + 1) % listItems.length;
    } else if (event.key === 'ArrowUp') {
        // Nach oben navigieren
        selectedIndex = (selectedIndex - 1 + listItems.length) % listItems.length;
    } else {
        return; // Wenn keine Pfeiltaste gedrückt wurde, beende die Funktion
    }

    // Entferne zuvor hinzugefügte Klasse für aktive Auswahl
    listItems.forEach(item => item.classList.remove('active-per-arrow'));

    // Setze die Klasse für die ausgewählte Option
    listItems[selectedIndex].classList.add('active-per-arrow');
});

// Füge einen Event-Listener für das Klicken auf die ausgewählte Option hinzu
document.addEventListener('keydown', function (event) {
    

    if (event.key === 'Enter' && selectedIndex !== -1) {
        event.preventDefault(); // Verhindere das Standardverhalten der Enter-Taste

        const selectedElement = dropdownList.querySelectorAll('li')[selectedIndex];
        // Setze die Werte für die ausgewählte Option
        clickedTitle = selectedElement.querySelector('div').textContent.split(',')[0].trim();
        clickedYear = selectedElement.querySelector('div').textContent.split(',')[1].slice(1, 5);
        clickedImg = selectedElement.querySelector('img').src;
        clickedID = selectedElement.querySelector('p').textContent;

        // Führe die gewünschte Aktion für die ausgewählte Option aus
        if (!document.getElementById(clickedID)) {
            pushMovie(clickedTitle, clickedYear, clickedImg, clickedID);
        } else {
            const movieElementSingle = document.getElementById(clickedID);
            movieElementSingle.classList.add('alreadyAdded');
            setTimeout(function () {
                movieElementSingle.classList.remove('alreadyAdded');
            }, 500);
        }
        // console.log('Ausgewählte Option:', selectedElement.textContent, clickedTitle, clickedYear, clickedImg, clickedID);
    }
});



//  input.addEventListener('keypress', async function (e) {
//     if (e.key === 'Enter') {
//         const previousContent = filmEle.innerHTML;
//         await getMovie();
//         // console.log(filmTitle);
//         if (filmTitle !== undefined) {
//             console.log(filmTitle, filmYear, filmImg);
//             filmEle.innerHTML = previousContent + `<div class="movie" id="movie">
//                                                    <img id="moviePic"src="https://image.tmdb.org/t/p/w200/${filmImg}" alt="">
//                                                      <div class="movie-title" id="movieTitle">${filmTitle}</div>
//                                                     <div class="movie-year" id="movieYear">(${(filmYear)})</div>  
//                                                     </div>`;
//         } 
//     }
//  });

//  inputButton.addEventListener('click', async function () {
    
//         const previousContent = filmEle.innerHTML;
//         await getMovie();
//         console.log(filmTitle);
//         filmEle.innerHTML = previousContent + `<div class="movie" id="movie">
//                             <img id="moviePic"src="https://image.tmdb.org/t/p/w200/${filmImg}" alt="">
//                             <div class="movie-title" id="movieTitle">${filmTitle}</div>
//                             <div class="movie-year" id="movieYear">(${(filmYear)})</div>  
//                             </div>`;
    
//  });


 