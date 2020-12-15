let filmStorage = [];

function setFilmInfo(name) {
    let img = document.createElement('img'),
        overview = document.createElement('div'),
        remove = document.createElement('div');

    remove.innerHTML = "remove";
    remove.className = "removebtn";
    remove.onclick = function () {
        this.parentNode.remove();
        filmStorage.splice(filmStorage.indexOf(name), 1);
        localStorage.setItem("films", JSON.stringify(filmStorage));
    }
    remove.onmouseover = function() {
        this.style.cursor = "pointer";
    }

    const http = new XMLHttpRequest();
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${config.API_KEY}&query=${name}`;
    http.open("GET", url);
    http.send();
    
    let posterPath = "https://image.tmdb.org/t/p/original"

    http.onreadystatechange = function (event) {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(http.response);

            overview.innerHTML = response.results[0].overview;
            overview.className = "film-overview";
            img.src = posterPath + response.results[0].poster_path;
            
            document.getElementById(name.trim().replaceAll(" ", "").toLowerCase())
                    .append(img, overview, remove);
            document.getElementById(name.trim().replaceAll(" ", "").toLowerCase())
                    .querySelector('.filmTitle').textContent = response.results[0].original_title;
        }
    }
}

function addFilm(name) {
    const film = document.createElement('div');
    film.className = "film";
    film.id = name.trim().replaceAll(" ", "").toLowerCase();

    film.innerHTML = `
        <span class="filmTitle"> ${name} </span>
    `;

    setFilmInfo(name);
    return film;
}

window.addEventListener('load', function () {
    let filmStorageString = localStorage.getItem('films'),
        filmInput = document.getElementById('film-input');

    if (filmStorageString) {
        filmStorage = JSON.parse(filmStorageString);
        for (let film of filmStorage) {
            document.querySelector('.films')
                    .prepend(addFilm(film));
        }
    }
    
    document.getElementById('film-submit').onclick = function() {
        if (filmInput.value.trim() != "") {
            filmStorage.push(filmInput.value);
            localStorage.setItem("films", JSON.stringify(filmStorage));
            document.querySelector('.films')
                    .prepend(addFilm(filmInput.value));
        }
    }
});