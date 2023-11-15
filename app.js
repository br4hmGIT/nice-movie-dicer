
const input = document.getElementById('search');
const dropdownList = document.getElementById('dropdown-list');
const movieSuggest = document.getElementById('movieSuggest');
const inputButton = document.getElementById('inputBtn')
const filmEle = document.getElementById('movieWrapper')
let filmTitle = '';
let filmYear = '';
let filmImg = '';

// API





const url = `https://moviesdatabase.p.rapidapi.com/titles/search/title/`;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '4ffa694460msh1220e06ad9b72fep164afajsnbcde7aca3aed',
		'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
	}
};

async function getMovie() {
try {
	const searchTerm = input.value;
    const searchUrl = `${url}${searchTerm}?titleType=movie&list=most_pop_movies`;
    const response = await fetch(searchUrl, options);

    console.log('Das ist meine Response: '+ response);

        if (!response.ok) {
                alert(`${response.status}`);
        }

    const result = await response.json();
    console.log(result);

    if (result.results.length == 0) {
        alert(`No Film Found`);
        filmTitle = undefined;      
    }

    filmTitle = (result.results[0].originalTitleText.text);
    filmYear = (result.results[0].releaseYear.year);
    filmImg = (result.results[0].primaryImage.url);
    console.log(filmTitle);
	
} catch (error) {
	console.error(error);
}
}

let findMovieTitle, findMovieYear, findMovieImg;

async function findMovie() {
    try {
        const searchTerm = input.value;
        const searchUrl = `${url}${searchTerm}?titleType=movie&list=most_pop_movies`;
        const response = await fetch(searchUrl, options);
    
        console.log('Das ist meine Response: '+ response);
    
    
    
        const result = await response.json();
        console.log('Das Result: ')
        console.log(result);

        dropdownList.innerHTML = '';
        
       
        // const resultArray = Object.values(result);
        result.results.forEach(obj => {
            console.log('DIE SCHLEIFE:');
            const findMovieTitle = obj.originalTitleText.text;
            const findMovieYear = obj.releaseYear.year;
            const findMovieImg  = obj.primaryImage.url;

            console.log(findMovieTitle);
            console.log(findMovieYear);
            console.log(findMovieImg);

            const listItem = document.createElement('li');
            listItem.id = 'movieSuggest'
            listItem.innerHTML = `<img style="max-height:100px;" src="${findMovieImg}" alt="">${findMovieTitle}, ${findMovieYear}`;
            dropdownList.appendChild(listItem);
        });

        
    } catch (error) {
        console.error(error);
    }
    }


    async function pushMovie() {
        const previousContent = filmEle.innerHTML;
        await getMovie();
        console.log(filmTitle);
        filmEle.innerHTML = previousContent + `<div class="movie" id="movie">
                            <img id="moviePic"src="${filmImg}" alt="">
                            <div class="movie-title" id="movieTitle">${filmTitle}</div>
                            <div class="movie-year" id="movieYear">(${(filmYear)})</div>  
                            </div>`;
       
        }
    

        document.addEventListener('click', function (event) {
            if (event.target.id === 'movieSuggest') {
                pushMovie();
            }
        });

// input.addEventListener('input', getMovieDetails);

 input.addEventListener('keypress', async function (e) {
    if (e.key === 'Enter') {
        const previousContent = filmEle.innerHTML;
        await findMovie();
        // console.log(filmTitle);
        if (filmTitle !== undefined) {
            console.log(filmTitle, filmYear, filmImg);
            filmEle.innerHTML = previousContent + `<div class="movie" id="movie">
                                                   <img id="moviePic"src="${filmImg}" alt="">
                                                     <div class="movie-title" id="movieTitle">${filmTitle}</div>
                                                    <div class="movie-year" id="movieYear">(${(filmYear)})</div>  
                                                    </div>`;
        } 
    }
 });

 inputButton.addEventListener('click', async function () {
    
        const previousContent = filmEle.innerHTML;
        await getMovie();
        console.log(filmTitle);
        filmEle.innerHTML = previousContent + `<div class="movie" id="movie">
                            <img id="moviePic"src="${filmImg}" alt="">
                            <div class="movie-title" id="movieTitle">${filmTitle}</div>
                            <div class="movie-year" id="movieYear">(${(filmYear)})</div>  
                            </div>`;
    
 });


 