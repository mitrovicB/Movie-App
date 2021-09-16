const searchBar = document.getElementById('movie-search');
console.log(searchBar.value);

searchBar.addEventListener('keyup', function(e) {
    const term = e.target.value; // .toLowerCase()
    document.getElementById('movie').innerText = term;
})


let movie_name = "joker";
const api_key = "9a1ebd23";
var url =   "http://www.omdbapi.com/?s=" + movie_name + "&apikey=" + api_key;
// var movieurl =  "http://www.omdbapi.com/?t=joker&apikey=9a1ebd23";


function loadImg() {
    var xhttp = new XMLHttpRequest();
    console.log('New XMLHttpRequest object:');
    console.log(xhttp);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText)
        var responseObject = JSON.parse(this.responseText);
        const movie_items = responseObject["Search"];
        movie_items.map((movie) => {
            document.getElementById('movie-list').innerHTML += "<img src='" + movie.Poster + "' alt='movie-image' class='movie-poster' /><li class='movie-info'>" + movie.Title + movie.Year +  "</li>"
            });
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

loadImg();