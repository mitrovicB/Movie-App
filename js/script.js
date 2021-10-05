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
      
      <div class="pagers">
          <button id="btn-prev" class="btn_prev">&#60; Back</button>
          <button id="btn-next" class="btn_next">Next &#62;</button>
      </div>
      page: <span id="page"></span>
      <button id="getOne-btn">Get one</button>
      <div id="my-movie"></div>
  </div>`.trim(),
  searchPage: function() {
    document.getElementById(this.containerId).innerHTML = this.movieListTemplate;
    document.getElementById('searchPage').onclick = this.searchPage.bind(this);
    document.getElementById('myListPage').onclick = this.myListPage.bind(this);
    document.getElementById('movie-search').onkeyup = this.getMovies.bind(this);
   // document.getElementById('getOne-btn').onclick = this.getOneMovie.bind(this);
    const btn_next = document.getElementById('btn-next');
    btn_next.onclick = this.nextPage.bind(this, page);
    const btn_prev = document.getElementById('btn-prev');
    btn_prev.onclick = this.prevPage.bind(this, page);
  },

  getMovies: function() {
    let movie = document.getElementById("movie-search").value;
    console.log("movie you are searching for: " + movie);
    console.log("this currentPage is: " + this.currentPage)
    if (movie.length > 2) {
      this.fetchData(movie, this.currentPage);
      this.show = false;
    }
  },
 /* getOneMovie: function(movie) {
    document.getElementById(this.containerId).innerHTML = this.moviePageTemplate;
    movie = "Batman"
    const url = this.API_URL + "t=" + movie + this.API_KEY;
    fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json(); 
      } else {
      throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then((data) => {
      console.log(data);
      document.getElementById('title').innerHTML = data.Title;
      document.getElementById('year').innerHTML = data.Year;
      document.getElementById('my-movie'). innerHTML = data.Title;
      document.getElementById('movie-poster').src = data.Poster;
      document.getElementById('release').innerHTML = data.Released;
      document.getElementById('director').innerHTML = data.Director;
     document.getElementById('actors').innerHTML = data.actors;
      document.getElementById('plot').innerHTML = data.Plot
    })
    .catch((error) => console.error("FETCH ERROR:", error));
  }, */
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
      console.log(data);
      this.displayMovies(data, this.currentPage);
    })
    .catch((error) => console.error("FETCH ERROR:", error)); 
  },
  
  displayMovies: function(data, page) {
    console.log("in display: " + page)

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

    console.log("numOfPages: " + numOfPages);
    console.log("movies length: " + movies.length);

    for (let i = (page - 1) * this.moviesPerPage; i < (page * this.moviesPerPage) && i < movies.length; i++) {
      console.log(i);
      console.log(movies[i]);
      page_span.innerHTML = page + "/" + numOfPages;
      movieList.innerHTML += `
        <li id=${movies[i].imdbID}>
          <img src=${movies[i].Poster} />
          <h2>${movies[i].Title}</h2>
          <h3>${movies[i].Year}<h3>
        </li>
       `
      }
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
      console.log(this.currentPage);
    }
    
  },

  showMoviePage: function() {
    document.getElementById(this.containerId).innerHTML = this.moviePageTemplate;
    this.getMovieById();
  },
  getMovieById: function() {
    console.log("here goes api call");
    let link = "http://www.omdbapi.com/?i=" + id + this.API_KEY;
    console.log(link);
  },

  myListPage: function() {
    document.getElementById(this.containerId).innerHTML = this.movieListTemplate;
    this.createMyList();
  },
  createMyList: function() {
    document.getElementById('search-screen').style.display = 'none';
    let myArr = ["joker", "batman", "monster"];
    for (i = 0; i <= myArr.length; i++) {
     console.log(i)
     this.getMovieList(myArr.length, myArr)
    }
  },
  moviePageTemplate: 
  `
  <div class="movie-screen" id="pageTwo">
    <h1 id="title">Name</h1>
    <p id="year">Year<p>
    <div class="image-container">
        <img  src="http://lorempixel.com/200/200/nightlif/3" class="movie-image" id="movie-poster"/>
    </div>
    <p class="movie-info" id="release">Released:</p>
    <p class="movie-info" id="genre">Genre:</p>
    <p class="movie-info" id="director">Director:</p>
    <p class="movie-info" id="actors">Actors:</p>
    <p class="movie-info" id="plot">Plot:</p>
    <div>
      <button id="movie-page-btn">Add to My List</button>
    </div>
  </div>`.trim()
}

app.searchPage();