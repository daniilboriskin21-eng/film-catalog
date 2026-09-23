let currentMode = "all";
let currentSearch = "";
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");

const emptyMessage = document.querySelector(".empty-message");

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

  const movies = document.querySelectorAll(".movie-list__item");

  movies.forEach((movie) => {
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

  const movies = document.querySelectorAll(".movie-list__item");

  movies.forEach((movie) => {
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
