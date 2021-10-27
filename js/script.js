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
        <button id="btn-prev" class="btn_prev">&#60; Back</button>
        <button id="btn-next" class="btn_next">Next &#62;</button>
        <span id="page" class="page_no"></span>
      </div>
    </div>`.trim(),
  toggleActiveTab: function(page) {
    page = 1;
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
  searchPage: function(page) {
    this.toggleActiveTab();
  
    document.getElementById(this.containerId).innerHTML = this.movieListTemplate;
    document.getElementById('searchPage').onclick = this.searchPage.bind(this);
    document.getElementById('myListPage').onclick = this.myListPage.bind(this);
    document.getElementById('movie-search').onkeyup = this.getMovies.bind(this);
  },
  splitArrayIntoChunks: function(arr, chunkSize) {
    const res = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
          const chunk = arr.slice(i, i + chunkSize);
          res.push(chunk);
      }
    return res;
  },
  myListPage: function(page) {
    this.toggleActiveTab();
    document.getElementById(this.containerId).innerHTML = this.myListTemplate;
    this.onSearchPage = false;
    page = this.currentPage;


    const retrievedData = localStorage.getItem("movieID");
    let favoriteMovies = JSON.parse(retrievedData);
      if (favoriteMovies === null) {
        document.getElementById(this.containerId).innerHTML = "No movies on your list";
        return;
      }

      if(favoriteMovies.length >= this.moviesPerPage) {
        this.showPageButtons();
      }

    const numOfPages = this.numPages(favoriteMovies.length, this.moviesPerPage);
    console.log("number of pages: " + numOfPages+ " and page: " + page);
 
   
    let arrayInChunks = this.splitArrayIntoChunks(favoriteMovies, this.moviesPerPage, page);

    let move = 0;
    console.log(arrayInChunks[move]);

      if (page === 1) {
        this.apiCall(arrayInChunks,move, page);
      }
      else if(page > 1) {
        move++;
        this.apiCall(arrayInChunks, move, page);
      } 
  },
  apiCall: function(chunk, move, page) {
    for(i=0; i < chunk[move].length; i++) {
      console.log(chunk[move][i]);
      let movieUrl = "http://www.omdbapi.com/?i=" + chunk[move][i] + this.API_KEY;
      this.fetchDataFavorites(movieUrl, myList, page);
      }
  },
  fetchDataFavorites: function(url, list, page) {
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
        if (data.totalResults === 0) console.log(data.Error);
      const myList = document.getElementById('myList');
     this.createList(myList, data);
    })
    .catch((error) => console.error("FETCH ERROR:", error)); 
  },
  createList: function(list, movie_data) {
    list.innerHTML += `
    <li id=${movie_data.imdbID} class="list-item" onclick="app.getMovieInfo(this.id)">
      <img src=${movie_data.Poster} class="movie-img" />
      <h2>${movie_data.Title}</h2>
      <p>${movie_data.Year}</p>
      <button class="modal-btn">Remove</button>
    </li>    <h3 id="message"></h3>
    `
  },
  myListTemplate: `
    <div class="tab-content">
      <ul id="myList" class="movie-list"></ul>
    </div>
    <div id="page-buttons" class="pagers">
        <button id="btn-prev" class="btn_prev" disabled>&#60; Back</button>
        <button id="btn-next" class="btn_next">Next &#62;</button>
     </div>`.trim(),
  getMovies: function() {
    let movie = document.getElementById("movie-search").value;
    console.log("movie you are searching for: " + movie);

    const searchUrl = this.API_URL + "s=" + movie + "&page=" + this.currentPage + this.API_KEY;
    console.log("movie url: " + searchUrl);

    if (movie.length > 2) {
      this.fetchDataSearch(searchUrl, this.currentPage);
    }
  },
  fetchDataSearch: function(url) {
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
    this.showPageButtons();
    const movieList = document.getElementById('movie-list');
    let page_span = document.getElementById("page");
    
    movieList.innerHTML = "";
    const movies = data.Search;
    console.log(movies);
    let dataCount = data.totalResults;
   
    console.log("Number of Data: " + dataCount);
    let numOfPages = this.numPages(dataCount, this.moviesPerPage);

    // Validate page
    if (page < 1) page = 1;
    if (page > numOfPages) page = numOfPages;

    console.log("numOfPages: " + numOfPages);
    console.log("movies length: " + movies.length);

    page_span.innerHTML = page + "/" + numOfPages;

    for (let i = 0; i < (page * this.moviesPerPage) && i < movies.length; i++) {
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
      }
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
    console.log('filtered: ' + filtered)
    localStorage.setItem('movieID', JSON.stringify(filtered));
    this.hideModal();

    this.checkPage();
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
    this.getMovies();
    //this.checkPage();
  },
  checkPage: function(page) {
    if (this.onSearchPage) {
      this.getMovies(page);
    } else {
      this.myListPage(page);
    }
  },
  toggleModal: function() {
    const movieModal =  document.getElementById('myModal');
    if (this.hideModal) {
      movieModal.style.display = "block";
    } else {
      this.hideModal(movieModal);
    }
  },
  hideModal: function(modal) {
    document.getElementById('myModal').style.display = 'none';
  },
  showPageButtons: function() {
    document.getElementById('page-buttons').style.display = "block";
    const btn_next = document.getElementById('btn-next');
    btn_next.onclick = this.nextPage.bind(this);
    const btn_prev = document.getElementById('btn-prev');
    btn_prev.onclick = this.prevPage.bind(this);
  },
  numPages: function(data, records_per_page) {
    return Math.ceil(data / records_per_page);
  },
  nextPage: function(currentPage) {
    this.currentPage++;
    if (this.currentPage === 1) {
    document.getElementById('btn-prev').disabled = false;
    }
    return this.checkPage(this.currentPage);
  },
  prevPage: function(currentPage) {
    if (this.currentPage === 1) {
      document.getElementById('btn-prev').disabled = true;
    } else {
      this.currentPage--;
      return this.checkPage(this.currentPage);
    }
  }
}

app.searchPage();
document.body.onclick = app.hideModal;