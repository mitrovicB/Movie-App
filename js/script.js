let app = {
  containerId: 'movieApp',
  API_KEY: "&apikey=9a1ebd23",
  API_URL: "http://www.omdbapi.com/?",
  currentPage: 1,
  moviesPerPage: 10,
  onSearchPage: true,
  movieListTemplate: `
    <div class="tab-content">
      <div class="search-bar" id="searchBar">
          <div class="input-icons">
              <i class="fa fa-search icon"></i>
              <input id="movie-search" class="input-field" type="text" placeholder="Search for the movie" />
          </div>
      </div>

      <div>
          <ul id="movie-list" class="movie-list"></ul>
      </div>

      <div id="page-buttons" class="pagers">
        <button id="btn-prev" class="btn_prev">&#60; Back</button>
        <button id="btn-next" class="btn_next">Next &#62;</button>
        <span id="page" class="page_no"></span>
      </div>
    </div>`.trim(),
  toggleActiveTab: function(page) {
    this.currentPage = 1;
    const header = document.getElementById('header');
    let tab_btns = header.getElementsByClassName('tab-link');
    for (let i = 0; i < tab_btns.length; i++) {
      tab_btns[i].addEventListener("click", function() {
      let current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
      });
    }
  },
  /* Start Page === Search tab */
  searchPage: function() {
    this.toggleActiveTab();
    document.getElementById(this.containerId).innerHTML = this.movieListTemplate;
    document.getElementById('searchPage').onclick = this.searchPage.bind(this);
    document.getElementById('myListPage').onclick = this.myListPage.bind(this, this.currentPage, false);
    document.getElementById('movie-search').onkeyup = this.getMovies.bind(this);
  },

  getMovies: function(page, bool) {
    let movieTitle = document.getElementById("movie-search").value;
    bool = this.onSearchPage;
    console.log("movie you are searching for: " + movieTitle);
    const searchUrl = this.API_URL + "s=" + movieTitle + "&page=" + page + this.API_KEY;
    console.log("movie url: " + searchUrl);

    if (movieTitle.length > 2) {
      this.displayMovies(searchUrl, this.currentPage, true).catch((error) => console.error("FETCH ERROR:", error)); ;
    }
  },
  displayMovies: async function(movie_url, page, bool) {
    console.log("Page number: " + page);
    this.onSearchPage = bool;

    const movieList = document.getElementById('movie-list');
    const page_span = document.getElementById("page");

    const fetchData = await fetch(movie_url).then(response => response.json());

    movieList.innerHTML = "";

    const allMovies = fetchData.Search;
    const dataCount = fetchData.totalResults;

    let numOfPages = this.numPages(dataCount, this.moviesPerPage);
    
      // Validate page
      if (page < 1) page = 1;
      if (page > numOfPages) page = numOfPages;
      page_span.innerHTML = page + "/" + numOfPages;

    console.log("totalResults: " + dataCount);
    console.log("numOfPages: " + numOfPages);
    this.showPageButtons(page, numOfPages, this.onSearchPage);

    for (let i = 0; i < (page * this.moviesPerPage) && i < allMovies.length; i++) {
      console.log(allMovies[i])
      app.createList(movieList, allMovies[i], bool);
    }
  },
  createList: function(list, movie_data, bool) {
    list.innerHTML += `
    <li id=${movie_data.imdbID} class="list-item" onclick="app.getMovieInfo(this.id)">
      <img src=${movie_data.Poster} class="movie-img" />
      <h2>${movie_data.Title}</h2>
      <p>${movie_data.Year}</p>
      <div id="remove-button"></div>
    </li> 
    `
    if (bool && this.isInStorage(movie_data.imdbID)) {
      console.log('IN STORAGE');
      this.addStar(movie_data.imdbID);
    } else if (!bool && this.isInStorage(movie_data.imdbID)) {
      this.addButton(movie_data.imdbID);
    }
  },
  addButton: function(id) {
    let removeDiv = document.getElementById(id);
    let createBtn = document.createElement('button');
    createBtn.innerHTML = 'Remove';
    createBtn.classList.add('rm-btn');
    createBtn.style.display = 'block';
    removeDiv.appendChild(createBtn);
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
    console.log("id number: " + id);
    let movieUrl = this.API_URL + "i=" + id + this.API_KEY;
    console.log(movieUrl);
    window.onclick = app.hideModal();

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
        <div class="modal-btn-position">
          <button id="movie-modal-btn" class="modal-btn"></button>
        </div>
      </div>
    `
    let movieId = data.imdbID;
    const storageBtn = document.getElementById('movie-modal-btn');
    this.checkStorage(movieId, storageBtn);
  },
  toggleModal: function() {
    const movieModal =  document.getElementById('myModal');
    if (this.hideModal) {
      movieModal.style.display = "block";
    } else {
      this.hideModal(movieModal);
    }
  },
  hideModal: function() {
    document.getElementById('myModal').style.display = 'none';
  },
  isInStorage: function(id) {
    let movieArr = JSON.parse(localStorage.getItem('movieID'));
    if (movieArr === null) {
      return false;
    }
    if (movieArr.includes(id))  {
      return true;
    }
  },
  checkStorage: function(id, buttonName) {
    if (this.isInStorage(id)) {
      buttonName.innerHTML = "Remove";
      buttonName.addEventListener('click', () => {
        return this.removeFromFavorites(id);
      })
    } else {
      buttonName.innerHTML = "Add to my List";
      buttonName.addEventListener('click', () => {
       return this.saveToFavorites(id);
      });
    }
  },
  removeFromFavorites: function(id) {
    let movieArr = JSON.parse(localStorage.getItem('movieID'));
    let filtered = movieArr.filter(item => item !== id);
    console.log('filtered: ' + filtered);
    localStorage.setItem('movieID', JSON.stringify(filtered));
    this.pageCheck(this.currentPage, this.onSearchPage);
    this.hideModal();
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
    this.pageCheck(this.currentPage, this.onSearchPage);
  },
  getMoviesFromStorage: function(page) {
    /* Get all movies you have in Local Storage */
    const retrievedData = localStorage.getItem("movieID");
    let favorites = JSON.parse(retrievedData);
      if (favorites === null) {
        document.getElementById(this.containerId).innerHTML = "No movies on your list";
        return;
      } else if (favorites.length >= this.moviesPerPage) {
        this.showPageButtons(page, favorites.length, false);
      }
      return favorites;
  },
  splitArrayIntoChunks: function(arr, chunkSize) {
    const res = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
          const chunk = arr.slice(i, i + chunkSize);
          res.push(chunk);
      }
    return res;
  },
  /* My List Tab */
  myListPage:  function(page, bool) {
    document.getElementById('searchBar').style.display = 'none';
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = "";
    this.toggleActiveTab();
    this.onSearchPage = bool;
    console.log(this.onSearchPage);

    console.log(this.getMoviesFromStorage(page));
    const favoriteMovies = this.getMoviesFromStorage(page);


    let arrayInChunks = this.splitArrayIntoChunks(favoriteMovies, this.moviesPerPage, page);
    console.log(arrayInChunks);

    let move = 0;
    console.log(arrayInChunks[move]);

    if (page === 1) {
      console.log(move)
      this.apiCall(arrayInChunks, move, bool, movieList);
    }
    else if(page > 1) {
      move++;
      console.log(move)
      this.apiCall(arrayInChunks, move, bool, movieList);
    } 

   const numOfPages = this.numPages(favoriteMovies.length, this.moviesPerPage);
    console.log("num of pages: " + numOfPages);
  },
  apiCall: async function(chunk, move, bool, list) {
    let myArr = []
    for(i=0; i < chunk[move].length; i++) {
      let movieUrl = "http://www.omdbapi.com/?i=" + chunk[move][i] + this.API_KEY;
      console.log(movieUrl);
      fetchData = await fetch(movieUrl).then(response => response.json())
      myArr.push(fetchData);
      console.log(myArr[i]);
      this.createList(list, myArr[i], bool);
      }
      
  },
  showPageButtons: function(pageNo, totalPages, bool) {
    console.log(pageNo);
    document.getElementById('page-buttons').style.display = "block";
    const btn_next = document.getElementById('btn-next');
    btn_next.onclick = this.nextPage.bind(this, bool);
    const btn_prev = document.getElementById('btn-prev');
    btn_prev.onclick = this.prevPage.bind(this, bool);
    if (pageNo === 1) {
      btn_prev.disabled = true;
      btn_next.disabled = false;
    } else if (pageNo >= totalPages) {
      btn_next.disabled = true;
    } else {
      btn_prev.disabled = false;
    }
  },
  numPages: function(data, records_per_page) {
    return Math.ceil(data / records_per_page);
  },
  pageCheck: function(page, bool) {
    console.log("pageCheck: " + page + " and boolean is: " + bool);
    this.onSearchPage = bool;

    if (this.onSearchPage) {
      this.getMovies(page, bool);
    } else {
      console.log("page: " + page);
      this.myListPage(page, bool);
    }
  },
  nextPage: function(bool) {
    this.currentPage++;
    console.log(this.currentPage);
    return this.pageCheck(this.currentPage, bool);
  },
  prevPage: function(bool) {
    this.currentPage--;
    return this.pageCheck(this.currentPage, bool);
  }
}

app.searchPage();
document.body.onclick = app.hideModal;