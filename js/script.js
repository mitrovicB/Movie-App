let app = {
  containerId: 'movieApp',
  API_KEY: "&apikey=9a1ebd23",
  API_URL: "http://www.omdbapi.com/?",
  movieDetails: [],
  currentPage: 1,
  moviesPerPage: 10,
  show:  false,
  lastClickedMovieId: null,
  movieListTemplate: 
  `
    <div id="search-screen" class="tab-content active">
      <div class="search-bar">
          <div class="input-icons">
              <i class="fa fa-search icon"></i>
              <input id="movie-search" class="input-field" type="text" placeholder="type name of the movie">
          </div>
      </div>

      <div id="movies">
          <ul id="movie-list" class="movie-list">
          </ul>
      </div>

      <div class="modal" id="myModal"></div>
      
      <div id="page-buttons" class="pagers">
          <button id="btn-prev" class="btn_prev">&#60; Back</button>
          <button id="btn-next" class="btn_next">Next &#62;</button><br>
          page: <span id="page"></span>
      </div>
  </div>`.trim(),
  searchPage: function() {
    document.getElementById(this.containerId).innerHTML = this.movieListTemplate;
    document.getElementById('searchPage').onclick = this.searchPage.bind(this);
    document.getElementById('myListPage').onclick = this.myListPage.bind(this);
    document.getElementById('movie-search').onkeyup = this.getMovies.bind(this);
    const btn_next = document.getElementById('btn-next');
    btn_next.onclick = this.nextPage.bind(this, page);
    const btn_prev = document.getElementById('btn-prev');
    btn_prev.onclick = this.prevPage.bind(this, page);
  },
  myListPage: function() {
    document.getElementById(this.containerId).innerHTML = this.myListTemplate;
  },
  myListTemplate: `
    <div id="myList">
      <p>Here goes my list</p>
    </div>
  `.trim(),
  getMovies: function() {
    let movie = document.getElementById("movie-search").value;
    console.log("movie you are searching for: " + movie);
    console.log("this currentPage is: " + this.currentPage)
    if (movie.length > 2) {
      this.fetchData(movie, this.currentPage);
      this.show = false;
    }
  },
  fetchData: function(movie) {
    const url = this.API_URL + "s=" + movie + "&page=" + this.currentPage + this.API_KEY;
    console.log("movie url: " + url);
  
    fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json(); 
      } else {
      throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then((data) => {
      console.log(data.totalResults);
      if (data.totalResults === 0) console.log(data.Error);
      this.displayMovies(data, this.currentPage);
    })
    .catch((error) => console.error("FETCH ERROR:", error)); 
  },
  displayMovies: function(data, page) {
    console.log("in display: " + page)
    document.getElementById('page-buttons').style.display = "block";
    const movieList = document.getElementById('movie-list');
    let page_span = document.getElementById("page");
    movieList.innerHTML = "";
    const movies = data.Search;
    console.log(movies);
    let dataCount = data.totalResults;
   
    console.log("number of Data: " + dataCount);
    let numOfPages = this.numPages(dataCount, this.moviesPerPage);

    // Validate page
    if (page < 1) page = 1;
    if (page > numOfPages) page = numOfPages;
    console.log(page)
    console.log("numOfPages: " + numOfPages);
    console.log("movies length: " + movies.length);

    page_span.innerHTML = page + "/" + numOfPages;

    for (let i = 0; i < (page * this.moviesPerPage) && i < movies.length; i++) {
      console.log(i);
      console.log(movies[i]);
      movieList.innerHTML += `
        <li id=${movies[i].imdbID} class="list-item" onclick="app.getMovieInfo(this.id)">
          <img src=${movies[i].Poster} />
          <h2>${movies[i].Title}</h2>
          <h3>${movies[i].Year}<h3>
        </li>
       `
    }
  },
  getMovieInfo: function(id) {
    console.log(id);
    let movieUrl = "http://www.omdbapi.com/?i=" + id + this.API_KEY;
    console.log(movieUrl);
   
    fetch(movieUrl)
    .then((response) => {
      if (response.ok) {
        return response.json(); 
      } else {
      throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then((data) => {
      console.log(data);
      this.openModal(data);
    })
    .catch((error) => console.error("FETCH ERROR:", error)); 
  },
  openModal: function(data) {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";

    modal.innerHTML = `
    <div class="modal-content">
      <h1 id="title">${data.Title}</h1>
      <p id="year">${data.Year}<p>
      <div class="image-container">
          <img class="movie-image" src=${data.Poster} id="movie-poster"/>
      </div>
      <p class="movie-info" id="release">Released: ${data.Released}</p>
      <p class="movie-info" id="genre">Genre: ${data.Genre}</p>
      <p class="movie-info" id="director">Director: ${data.Director}</p>
      <p class="movie-info" id="actors">Actors: ${data.Actors}</p>
      <p class="movie-info" id="plot">Plot: ${data.Plot}</p>
      <div>
        <button id="movie-page-btn">Add to My List</button>
      </div>
  </div>
  `  
},
  numPages: function(data, records_per_page) {
      return Math.ceil(data / records_per_page);
  },
  nextPage: function(currentPage) {
      this.currentPage++;
      console.log(this.currentPage);
      return this.getMovies(this.currentPage);
  },
  prevPage: function(currentPage) {
    if (this.currentPage <= 0) {
      document.getElementById('btn-prev').disabled = "true";
      return;
    } else {
      this.currentPage--;
      return this.getMovies(this.currentPage);
    }
  },
  createMyList: function() {
    document.getElementById('search-screen').style.display = 'none';
    let myArr = ["joker", "batman", "monster"];
    for (i = 0; i <= myArr.length; i++) {
     console.log(i)
     this.getMovieList(myArr.length, myArr)
    }
  }
}

app.searchPage();

window.onclick = function(event) {
  let modal = document.getElementById('myModal');
  if (event.target == modal) {
    modal.style.display = "none";
  }
}