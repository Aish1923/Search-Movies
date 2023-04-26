
// call searchMovies function on pressing Enter after text is input in Search
var searchText = document.getElementById("searchText");
searchText.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        searchMovies();
    }
});

//hit the api to fetch search results
async function searchMovies() {
    document.getElementById('cards-container').innerHTML = '';
    const searchVal = document.getElementById('searchText').value;
    //api key to be moved to diff location

    //Movie title to search for has the param key 's' from docs
    const url = `https://www.omdbapi.com/?s=${searchVal}&apikey=9ed1b69f`
    const response = await fetch(url);
    const moviesList = await response.json();
    if (moviesList?.Error) {
        document.getElementById('cards-container').innerHTML = 'No movies were found!';
    }
    else if (moviesList?.Search.length > 0) {
        renderMovieList(moviesList.Search)
    }
}

//dynamic creation of the card components to display movie information
function renderMovieList(movies) {
    let fragment = document.createDocumentFragment();
    movies.forEach((result) => {
        // create a new article element for each movie
        let article = document.createElement('article');
        article.id = `${result.imdbID}`;
        article.classList.add('movie-poster');
        article.style.position = 'relative';

        // create a div for the movie poster
        let imgDiv = document.createElement('div');
        let img = document.createElement('img');
        img.classList.add('movie-poster__img');
        img.src = result.Poster;
        imgDiv.appendChild(img);
        article.appendChild(imgDiv);

        // create a div for the movie title and year
        let titleDiv = document.createElement('div');
        let title = document.createElement('h3');
        title.classList.add('movie-poster__title');
        title.textContent = result.Title;
        let year = document.createElement('p');
        year.classList.add('movie-poster__year');
        year.textContent = result.Year;
        titleDiv.appendChild(title);
        titleDiv.appendChild(year);

        // create a div for the overlay text
        let overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.id = `overlay-${result.imdbID}`

        titleDiv.appendChild(overlay);

        article.appendChild(titleDiv);
        // append each new article element to the document fragment
        fragment.appendChild(article);
    });

    // append the document fragment to the DOM
    document.getElementById('cards-container').appendChild(fragment);

    //create overlay component to display more info on click listener
    let articles = document.querySelectorAll('.movie-poster');
    let previousOverlay = null;

    articles.forEach((article) => {
        let overlay = article.querySelector('.overlay');
        article.addEventListener('click', async function () {
            if (previousOverlay != overlay && previousOverlay) {
                previousOverlay.classList.remove('show');
                previousOverlay = null
            }
            overlay.classList.toggle('show');

            let plotDiv = overlay.querySelector('.movie-poster__plot');
            if (!plotDiv) {
                const details = await getMoreDetails(article.id);
                //append plot div to the DOM
                plotDiv = document.createElement('div');
                plotDiv.classList.add('movie-poster__plot', 'movie-poster__moreInfo');
                plotDiv.textContent = details.Plot;
                overlay.appendChild(plotDiv);

                //append Actor Information
                let ActorsDiv = document.createElement('div');
                ActorsDiv.classList.add('movie-poster__moreInfo');
                ActorsDiv.textContent = 'Actors: ' + details.Actors;
                overlay.appendChild(ActorsDiv);


                //append Director Information
                let DirectorDiv = document.createElement('div');
                DirectorDiv.classList.add('movie-poster__moreInfo');
                DirectorDiv.textContent = 'Director: ' + details.Director;
                overlay.appendChild(DirectorDiv);


                //append Rating Information
                let RatingsDiv = document.createElement('div');
                RatingsDiv.classList.add('movie-poster__moreInfo');
                RatingsDiv.textContent = 'Ratings: ' + details.Ratings[0].Value;
                overlay.appendChild(RatingsDiv);
            }
            previousOverlay = overlay;
        });

    });


}

// get more details about the movie 
async function getMoreDetails(id) {
    const url = `https://www.omdbapi.com/?i=${id}&apikey=9ed1b69f`
    const response = await fetch(url);
    const details = await response.json();
    return details;
}