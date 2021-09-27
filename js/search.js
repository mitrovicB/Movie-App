/*
const movie_list = document.getElementById('movie-list');
const showPageBtn = document.getElementById('show');
let counter;

const movieScreen = document.getElementById('pageTwo');

searchBar.addEventListener('keyup', function(e) {
    const term = e.target.value; // .toLowerCase()
    searchBar.value = term;
    console.log(term.length)
    if (term.length > 2) {
        loadMovies(term);
    }    
});

showPageBtn.addEventListener('click', moviePage);

buttonNext.addEventListener('click', nextPage);
buttonPrev.addEventListener('click', prevPage)

let movie_name = "joker";
const api_key = "9a1ebd23";
// var movieurl =  "http://www.omdbapi.com/?t=joker&apikey=9a1ebd23";

function loadMovies(movie_name) {
    const url =   "http://www.omdbapi.com/?s=" + movie_name  + "&apikey=" + api_key+ "&page=2";
    console.log(url);
    let movieArr = [];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
            const responseObject = JSON.parse(this.responseText);
            const totalResult = responseObject.totalResults;
            movieArr.push(responseObject);
            console.log(movieArr);
            const movie_items = responseObject["Search"];
          //  movieArr.push(movie_items);
        (responseObject.totalResults);

            movie_items.forEach(movie => {
                movie_list.innerHTML +=
                `<li class='movie-info' id='${movie.imdbID}'>
                    <img src='${movie.Poster}' alt='movie-image' class='movie-poster' /> ${movie.Title}<br />
                    <span>${movie.Year}</span>
                </li>`;
            });
        } else {
            console.log("error occured");
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

let movieId = document.querySelector('li');


function nextPage(val) {
    counter = counter + 5;
    console.log(counter)
    //counter = counter % val;
    console.log(val);
    //return val[counter];
}

function prevPage(val) {
    counter = counter - 5;
    console.log(counter);
}


function moviePage () {
    document.getElementById('pageOne').style.display = "none";
    movieScreen.style.display = "block";
} */
