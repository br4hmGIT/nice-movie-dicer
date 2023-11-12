
const input = document.getElementById('search');
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

async function getMovieDetails() {
try {
	const searchTerm = input.value;
    const searchUrl = `${url}${searchTerm}?titleType=movie&list=most_pop_movies`;
    const response = await fetch(searchUrl, options);
    // console.log(response);

    if (!response.ok) {
            alert(`${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    filmTitle = (result.results[0].originalTitleText.text);
    filmYear = (result.results[0].releaseYear.year);
    filmImg = (result.results[0].primaryImage.url);
    console.log(filmTitle);
	
} catch (error) {
	console.error(error);
}
}


// input.addEventListener('input', getMovieDetails);

 input.addEventListener('keypress', async function (e) {
    if (e.key === 'Enter') {
        const previousContent = filmEle.innerHTML;
        await getMovieDetails();
        console.log(filmTitle);
        filmEle.innerHTML = previousContent + `<div class="movie" id="movie">
                            <img id="moviePic"src="${filmImg}" alt="">
                            <div class="movie-title" id="movieTitle">${filmTitle}</div>
                            <div class="movie-year" id="movieYear">(${(filmYear)})</div>  </div>`;
    }
 });

 inputButton.addEventListener('click', async function () {
    
        const previousContent = filmEle.innerHTML;
        await getMovieDetails();
        console.log(filmTitle);
        filmEle.innerHTML = previousContent + `<div class="movie" id="movie">
                            <img id="moviePic"src="${filmImg}" alt="">
                            <div class="movie-title" id="movieTitle">${filmTitle}</div>
                            <div class="movie-year" id="movieYear">(${(filmYear)})</div>  
                            </div>`;
    
 });

 // get Element and push it into div

 