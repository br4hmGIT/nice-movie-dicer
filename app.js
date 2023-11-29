'use strict';


const input = document.getElementById('search');
const dropdownList = document.getElementById('dropdown-list');
const movieSuggest = document.getElementById('movieSuggest');
const clearBtn = document.getElementById('clearBtn');
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


//  ++++++++++++++++

// async function getMovie() {
//     try {
// 	const searchTerm = input.value;
//     const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US&page=1`;

//     const response = await fetch(searchUrl, options);

//     console.log('Das ist meine Response: '+ response);

//         if (!response.ok) {
//                 alert(`${response.status}`);
//         }

//     const result = await response.json();
//     console.log(result.results.slice(0, 5));

//         if (result.results.length == 0) {
//             alert(`No Film Found`);
//             filmTitle = undefined;      
//         }

//     filmTitle = (result.results[0].original_title);
//     filmYear = (result.results[0].release_date);
//     filmImg = (result.results[0].poster_path);
//     console.log(filmTitle);
	
//         } catch (error) {
//             console.error(error);
//         }
// }


//  ++++++++++++++++


let findMovieTitle, findMovieYear, findMovieImg, filmID;

async function findMovie() {
    try {
        const searchTerm = input.value;
        const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US&page=1`;
        const response = await fetch(searchUrl, options);
    
        console.log('Das ist meine Response: '+ response);
    
        
    
        const result = await response.json();
        result.results.slice(0, 5);

        console.log('Das Result: ')
        console.log(result);

        dropdownList.innerHTML = '';
        
       
        // const resultArray = Object.values(result);
        for (let i = 0; i < 5 && i < result.results.length; i++) {
            const obj = result.results[i];
            // console.log('DIE SCHLEIFE:');
            filmTitle = obj.original_title;
            filmYear = obj.release_date.slice(0, 4);
            filmImg = obj.poster_path;
            filmID = obj.id;
            
        
            // console.log(findMovieTitle);
            // console.log(findMovieYear);
            // console.log(findMovieImg);
            
            
            const listItem = document.createElement('li');
            listItem.classList.add('movieSuggest'); // Verwenden Sie eine Klasse statt einer ID
            listItem.innerHTML = `<img style="max-height:100px;" src="https://image.tmdb.org/t/p/w200/${filmImg}" alt=""><div>${filmTitle}, ${filmYear}</div>
            <p id="movieID">${filmID}</p>
            `
           
            ;
            dropdownList.appendChild(listItem);
        }

        
    } catch (error) {
        console.error(error);
    }
}


    const addedMovieIds = new Set();

    document.addEventListener('click', function (event) {
          // Überprüfen, ob das geklickte Element oder eines seiner Eltern die Klasse 'movieSuggest' hat
        const clickedItem = event.target.closest('.movieSuggest');
        if (clickedItem) {
        // Extrahiere Informationen aus dem HTML des geklickten Elements
        const clickedTitle = clickedItem.querySelector('div').textContent.split(',')[0].trim();
        const clickedYear = clickedItem.querySelector('div').textContent.split(',')[1].slice(1, 5);
        const clickedImg = clickedItem.querySelector('img').src;
        const clickedID = clickedItem.querySelector('p').textContent;

        // console.log('DAS IST ES:' + clickedID);
    
            // Rufe die pushMovie-Funktion auf und übergebe die Informationen des geklickten Films
         

            if (!document.getElementById(clickedID)) {
                pushMovie(clickedTitle, clickedYear, clickedImg, clickedID);
            } else {
                const movieElementSingle = document.getElementById(clickedID);
                movieElementSingle.classList.add('alreadyAdded');
                setTimeout(function() {
                    // Entferne die Klasse nach dem Warten
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
        
        setTimeout(function() {
            movieElement.classList.remove('fadeInAnimation');
        }, 200);    
        
        
            
    function removeClick(event) {
        const clearSingleMovieBtn = event.target.closest('.remove-movie-button');
        if (clearSingleMovieBtn) {
            const parentElement = clearSingleMovieBtn.closest('.movie');
            
            parentElement.classList.add('fadeOutAnimation');
            setTimeout(function() {
                if (parentElement) {
                    parentElement.remove();
                }
            }, 200);
           
        }
    }
        
    document.addEventListener('dblclick', function (event) {
        handleButtonClick(event);
    });

        document.addEventListener('click', function (event) {
           removeClick(event);
        });
    }



// CLEAR-ALL BUTTON

clearBtn.addEventListener('click', async function () {
    
    setTimeout(function() {
        filmEle.innerHTML = '';
    }, 200);
    
   
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


 