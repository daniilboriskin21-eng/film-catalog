let currentMode = "all";
let currentSearch = "";
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const emptyMessage = document.querySelector(".empty-message");
const cardTemplate = document
    .querySelector("#movie-card-template")
    .content.querySelector(".movie-list__item");
const movieList = document.querySelector(".movie-list");

const movies = [
  {
    id: "1",
    title: "Интерстеллар",
    year: 2014,
    genre: "Фантастика",
    rating: 8.7,
    poster: "./assets/images/posters/interstellar.webp",
  },
  {
    id: "2",
    title: "Бегущий по лезвию 2049",
    year: 2017,
    genre: "Фантастика",
    rating: 8.7,
    poster: "./assets/images/posters/blade-runner-2049.webp",
  },
  {
    id: "3",
    title: "Интерстеллар",
    year: 2014,
    genre: "Фантастика",
    rating: 8.7,
    poster: "./assets/images/posters/interstellar.webp",
  },
  {
    id: "4",
    title: "Интерстеллар",
    year: 2014,
    genre: "Фантастика",
    rating: 8.7,
    poster: "./assets/images/posters/interstellar.webp",
  },
  {
    id: "5",
    title: "Интерстеллар",
    year: 2014,
    genre: "Фантастика",
    rating: 8.7,
    poster: "./assets/images/posters/interstellar.webp",
  },
  {
    id: "6",
    title: "Интерстеллар",
    year: 2014,
    genre: "Фантастика",
    rating: 8.7,
    poster: "./assets/images/posters/interstellar.webp",
  },
];

function createMovieCard(movie) {
  const card = cardTemplate.cloneNode(true);

  card.dataset.movieId = movie.id;
  
  const titleElement = card.querySelector(".movie-card__title");
  titleElement.textContent = movie.title;

  const yearElement = card.querySelector(".movie-card__year");
  yearElement.textContent = movie.year;

  const genreElement = card.querySelector(".movie-card__genre");
  genreElement.textContent = movie.genre;

  const ratingValueElement = card.querySelector(".movie-card__rating-value");
  ratingValueElement.textContent = movie.rating;

  const posterElement = card.querySelector(".movie-card__poster");
  posterElement.src = movie.poster;
  posterElement.alt = "Постер фильма " + movie.title;

  const buttonElement = card.querySelector(".movie-card__favorite");
  buttonElement.setAttribute("aria-label", "Избранное: " + movie.title);

  return card;
}

function renderMovies() {
  movieList.replaceChildren();

  movies.forEach((movie) => {
    movieList.append(createMovieCard(movie));
  })
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentSearch = searchInput.value.trim().toLowerCase();
  itemsFilter();
});

function itemsFilter() {
  const items = document.querySelectorAll(".movie-list__item");
  let visibleCount = 0;

  items.forEach((item) => {
    const button = item.querySelector(".movie-card__favorite");
    const isFavorite = button.getAttribute("aria-pressed") === "true";

    const title = item
      .querySelector(".movie-card__title")
      .textContent.toLowerCase();

    const isHidden =
      (currentMode === "favorites" && !isFavorite) ||
      !title.includes(currentSearch);

    item.hidden = isHidden;
    visibleCount += !isHidden ? 1 : 0;
  });

  if (visibleCount === 0) {
    emptyMessage.hidden = false;
    if (currentSearch) {
      emptyMessage.textContent = "По вашему запросу ничего не найдено";
    } else if (currentMode === "favorites") {
      emptyMessage.textContent = "В избранном пока ничего нет";
    } else {
      emptyMessage.textContent = "В каталоге пока нет фильмов";
    }
  } else {
    emptyMessage.hidden = true;
  }
}

function saveFavorites() {
  const moviesId = [];

  const movieItems = document.querySelectorAll(".movie-list__item");

  movieItems.forEach((movie) => {
    const button = movie.querySelector(".movie-card__favorite");
    const isFavorite = button.getAttribute("aria-pressed") === "true";

    if (isFavorite) moviesId.push(movie.dataset.movieId);
  });

  try {
    localStorage.setItem("film-catalog-favorites", JSON.stringify(moviesId));
  } catch (error) {
    console.warn(
      "Не удалось сохранить избранное. После перезагрузки последние изменения могут потеряться.",
      error,
    );
  }
}

function loadFavorites() {
  let moviesID = [];

  try {
    const lsMoviesID = JSON.parse(
      localStorage.getItem("film-catalog-favorites"),
    );
    if (Array.isArray(lsMoviesID)) moviesID = lsMoviesID;
  } catch (error) {
    console.warn(
      "Не удалось загрузить избранное. Используется пустой список.",
      error,
    );
  }

  const movieItems = document.querySelectorAll(".movie-list__item");

  movieItems.forEach((movie) => {
    const button = movie.querySelector(".movie-card__favorite");
    const icon = button.querySelector("span");
    if (moviesID.includes(movie.dataset.movieId)) {
      button.setAttribute("aria-pressed", "true");
      icon.textContent = "♥";
    } else {
      button.setAttribute("aria-pressed", "false");
      icon.textContent = "♡";
    }
  });
}

const modeButton = document.querySelectorAll(".catalog-nav__button");

modeButton.forEach((button) => {
  button.addEventListener("click", () => {
    currentMode = button.dataset.filter;

    modeButton.forEach((element) => {
      element.setAttribute(
        "aria-pressed",
        currentMode === element.dataset.filter,
      );
    });

    itemsFilter();
  });
});

renderMovies();

const favoriteButton = document.querySelectorAll(".movie-card__favorite");

favoriteButton.forEach((button) => {
  button.addEventListener("click", () => {
    const isFavorite = button.getAttribute("aria-pressed") === "true";

    button.setAttribute("aria-pressed", String(!isFavorite));

    const icon = button.querySelector("span");
    icon.textContent = isFavorite ? "♡" : "♥";

    updateFavoriteCount();

    itemsFilter();

    saveFavorites();
  });
});

const favoriteCount = document.querySelector(".favorites-count");

function updateFavoriteCount() {
  let count = 0;
  favoriteButton.forEach((button) => {
    if (button.getAttribute("aria-pressed") === "true") count++;
  });
  favoriteCount.textContent = String(count);
}

loadFavorites();
updateFavoriteCount();
itemsFilter();
