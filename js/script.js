window.onclick = function(event) {
    document.getElementById('myModal').style.display = 'none';
}

let app = {
  containerId: 'movieApp',
  API_KEY: "&apikey=9a1ebd23",
  API_URL: "http://www.omdbapi.com/?",
  currentPage: 1,
  moviesPerPage: 10,
  onSearchPage: true,
  movieListTemplate: `
    <div class="tab-content">
      <div class="search-bar">
          <div class="input-icons">
              <i class="fa fa-search icon"></i>
              <input id="movie-search" class="input-field" type="text" placeholder="Search for the movie" />
          </div>
      </div>

      <div>
          <ul id="movie-list" class="movie-list"></ul>
      </div>

      <div id="page-buttons" class="pagers">
          <button id="btn-prev" class="btn_prev" disabled>&#60; Back</button>
          <button id="btn-next" class="btn_next">Next &#62;</button>
         <span id="page" class="page_no"></span>
      </div>
    </div>`.trim(),
    toggleActiveTab: function(id_rem, id_add) {
      const header = document.getElementById('header');
      let btns = header.getElementsByClassName('tab-link');
      for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
        let current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
        });
      }
    },
  searchPage: function() {
    document.getElementById(this.containerId).innerHTML = this.movieListTemplate;
    document.getElementById('searchPage').onclick = this.searchPage.bind(this);
    document.getElementById('myListPage').onclick = this.myListPage.bind(this);
    document.getElementById('movie-search').onkeyup = this.getMovies.bind(this);
    const btn_next = document.getElementById('btn-next');
    btn_next.onclick = this.nextPage.bind(this);
    const btn_prev = document.getElementById('btn-prev');
    btn_prev.onclick = this.prevPage.bind(this);
    this.toggleActiveTab();
  },
  myListPage: function() {
    document.getElementById(this.containerId).innerHTML = this.myListTemplate;
    this.toggleActiveTab();
    this.onSearchPage = false;

    const myList = document.getElementById('myList');
    let retrievedData = localStorage.getItem("movieID");
    let favorites = JSON.parse(retrievedData);
    if (favorites == "") {
      document.getElementById(this.containerId).innerHTML = "No movies on your list";
    }
    for (i = 0; i < favorites.length; i++) {
     console.log(favorites[i]);
     let movieUrl = "http://www.omdbapi.com/?i=" + favorites[i] + this.API_KEY;
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
      if (data.totalResults === 0) console.log(data.Error);
      myList.innerHTML += `
        <li id=${data.imdbID} class="list-item" onclick="app.getMovieInfo(this.id)">
          <img src=${data.Poster} class="movie-img" />
          <h2>${data.Title}</h2>
          <p>${data.Year}</p>
          <button class="btn-style">Remove</button>
        </li>
        <h3 id="message"></h3>
      `
    })
    .catch((error) => console.error("FETCH ERROR:", error)); 
    }
  },
  myListTemplate: `
    <div class="tab-content">
      <ul id="myList" class="movie-list"></ul>
    </div>
  `.trim(),
  getMovies: function() {
    let movie = document.getElementById("movie-search").value;
    console.log("movie you are searching for: " + movie);
    console.log("currentPage is: " + this.currentPage);
    if (movie.length > 2) {
      this.fetchData(movie, this.currentPage);
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
    this.onSearchPage = true;
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

    console.log("numOfPages: " + numOfPages);
    console.log("movies length: " + movies.length);

    page_span.innerHTML = page + "/" + numOfPages;

    for (let i = 0; i < (page * this.moviesPerPage) && i < movies.length; i++) {
      console.log(i);
      console.log(movies[i]);
  
      movieList.innerHTML += `
        <li id=${movies[i].imdbID} class="list-item" onclick="app.getMovieInfo(this.id)">
          <img src=${movies[i].Poster} class="movie-img"/>
          <h2>${movies[i].Title}</h2>
          <p>${movies[i].Year}</p>
        </li>
       `

       if (this.isInStorage(movies[i].imdbID)) {
        console.log('IN STORAGE');
        app.addStar(movies[i].imdbID);
      };
    }
  },
  addStar: function(id) {
    let star = document.getElementById(id);
    let element = document.createElement('p');
    element.innerHTML = "★";
    element.classList.add("favorites-star");
    element.style.display = 'block';
    star.appendChild(element);
  },
  getMovieInfo: function(id) {
    console.log(id);
    let movieUrl = this.API_URL + "i=" + id + this.API_KEY;
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
    app.toggleModal();
    document.getElementById('myModal').innerHTML = `
      <div class="modal-content">
        <h1 id="title">${data.Title}</h1>
        <p id="year">${data.Year}<p>
        <div>
            <img class="movie-poster" src=${data.Poster} id="movie-poster"/>
        </div>
        <p class="movie-info" id="release">Released: ${data.Released}</p>
        <p class="movie-info" id="genre">Genre: ${data.Genre}</p>
        <p class="movie-info" id="director">Director: ${data.Director}</p>
        <p class="movie-info" id="actors">Actors: ${data.Actors}</p>
        <p class="movie-info" id="plot">Plot: ${data.Plot}</p>
        <div>
          <button id="my-btn" class="btn-style"></button>
        </div>
      </div>
    `
    let movieId = data.imdbID;
    const storageBtn = document.getElementById('my-btn');

      if (this.isInStorage(movieId)) {
        storageBtn.innerHTML = "Remove";
        storageBtn.addEventListener('click', () => {
          this.removeFromFavorites(movieId);
        })
      } else {
        storageBtn.innerHTML = "Add to my List";
        storageBtn.addEventListener('click', () => {
          this.saveToFavorites(movieId);
        });
      }
  },
  pageCheck: function() {
    if (this.onSearchPage) {
      window.onload = this.getMovies();
    } else {
      window.onload = this.myListPage();
    }
  },
  toggleModal: function() {
    let movieModal =  document.getElementById('myModal');
    if (movieModal.style.display === "none") {
      movieModal.style.display = "block";
    } else {
      movieModal.style.display = "none";
    }
  },
  isInStorage: function(id) {
    let movieArr = JSON.parse(localStorage.getItem('movieID'));
    if (movieArr.includes(id)) return true;
  },
  removeFromFavorites: function(id) {
    let movieArr = JSON.parse(localStorage.getItem('movieID'));
    let filtered = movieArr.filter(item => item !== id);
    console.log('filtered: ' + filtered)
    localStorage.setItem('movieID', JSON.stringify(filtered));
    this.pageCheck();
  },
  saveToFavorites: function(id) {
   let movieArr = JSON.parse(window.localStorage.getItem("movieID")) || [];

    if (movieArr.indexOf(id) == -1 && typeof(Storage) !== "undefined"){
      movieArr.push(id);
      localStorage.setItem("movieID", JSON.stringify(movieArr));
      console.log("movies: " + movieArr);
    } else {
      console.log("Sorry, your browser does not support Web Storage...");
    }
    this.pageCheck();
  },
  numPages: function(data, records_per_page) {
    return Math.ceil(data / records_per_page);
  },
  nextPage: function(currentPage) {
    this.currentPage++;
    document.getElementById('btn-prev').disabled = false;
    console.log(this.currentPage);
    return this.getMovies(this.currentPage);
  },
  prevPage: function(currentPage) {
    if (this.currentPage === 1) {
      document.getElementById('btn-prev').disabled = true;
    } else {
      this.currentPage--;
      return this.getMovies(this.currentPage);
    }
  }
}

app.searchPage();