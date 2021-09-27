let app = {
  containerId: 'movieApp',
  API_KEY: "&apikey=9a1ebd23",
  API_URL: "http://www.omdbapi.com/?",
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
  showStartPage: function() {
    document.getElementById(this.containerId).innerHTML = this.movieListTemplate;
  },
  searchPage: function() {
    document.getElementById(this.containerId).innerHTML = this.movieListTemplate;
    document.getElementById('searchPage').onclick = this.searchPage.bind(this);
    document.getElementById('myListPage').onclick = this.myListPage.bind(this);
    document.getElementById('movie-search').onkeyup = this.getMovies.bind(this);
    document.getElementById('btn-next').onclick = this.nextPage.bind(this);
    document.getElementById('btn-prev').onclick = this.prevPage.bind(this);
    document.getElementById('getOne-btn').onclick = this.getOneMovie.bind(this);
  },
  getMovies: function(e) {
    const movie = e.target.value; // add toLowerCase
    if (movie.length > 2) {
      this.loadMovies(movie);
    //  this.changePage(1);
    }
  },
  getOneMovie: function(movie) {
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
  },
  loadMovies: function(movie) {
    const url = this.API_URL + "s=" + movie + this.API_KEY;
    console.log(url);
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
      this.displayMovies(data); 
    })
    .catch((error) => console.error("FETCH ERROR:", error));
  },
  displayMovies: function(data) {
    const movies = data.Search;
    console.log(movies);
    let dataCount = data.totalResults;
    console.log(dataCount);
    let numOfPages = this.numOfPages(dataCount);
    console.log(numOfPages)
    let firstIndex = this.recordsPerPage * numOfPages;
    let lastIndex = this.recordsPerPage * (numOfPages + 1) - 1
    console.log(lastIndex)
    this.getMovieList(dataCount, movies);
  },
  getMovieList: function(num, data) {
    for (i = 0; i <= num; i++) {
      data.map((movie) => {
      const dataList = document.getElementById('movie-list');
      const list_item = document.createElement('li');
      const image = document.createElement('img');
      const title = document.createElement('h2');
      const year = document.createElement('h3');
      const movieId = `${movie.imdbID}`;
      year.innerHTML = `${movie.Year}`;
      title.innerHTML = `${movie.Title}`;
      image.src = `${movie.Poster}`;
      list_item.appendChild(image);
      list_item.appendChild(title);
      list_item.appendChild(year);
      dataList.appendChild(list_item);
      })
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
  numOfPages: function(resultsCount) {
    return Math.ceil(resultsCount / this.recordsPerPage);
  },
  changePage: function(page) {
    console.log(page);
    const btn_next = document.getElementById("btn-next");
    const btn_prev = document.getElementById("btn-prev");
    let page_span = document.getElementById("page");

    // Validate page
    if(page < 1) {
      page = 1;
    } else if (page > this.numPages()) {
      page = this.numPages();
    };

    //movieList.innerHTML = "";

    for (let i = (page-1) * this.recordsPerPage; i < (page * this.recordsPerPage); i++) {
      console.log('lets see');
    }
    page_span.innerHTML = page;

    if (page == 1) {
        btn_prev.disabled = "true";
    } else {
        btn_prev.disabled = "false";
    }

    if (page == this.numPages()) {
        btn_next.disabled = "true";
    } else {
        btn_next.disabled = "false";
    }
  },


  nextPage: function(page) {
    let currentPage = page;
    if (this.currentPage < this.numPages()) {
        this.currentPage++;
        this.changePage(currentPage);
    }
    console.log(this.currentPage)

  },
  prevPage: function() {
    if (this.currentPage > 1) {
      this.currentPage--;
     this.changePage(this.currentPage);
    }
    console.log(this.currentPage);

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