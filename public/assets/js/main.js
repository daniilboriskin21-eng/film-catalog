let currentMode = "all";

function itemsFilter() {
  const items = document.querySelectorAll(".movie-list__item");

  items.forEach((item) => {
    const button = item.querySelector(".movie-card__favorite");
    const isFavorite = button.getAttribute("aria-pressed") === "true";
    const isHidden = currentMode === "favorites" && !isFavorite;

    item.hidden = isHidden;
  });
}

function saveFavorites() {
  const moviesId = [];

  const movies = document.querySelectorAll(".movie-list__item");

  movies.forEach((movie) => {
    const button = movie.querySelector(".movie-card__favorite");
    const isFavorite = button.getAttribute("aria-pressed") === "true";

    if (isFavorite) moviesId.push(movie.dataset.movieId);
  });

  localStorage.setItem("film-catalog-favorites", JSON.stringify(moviesId));
}

function loadFavorites() {
  const moviesID =
    JSON.parse(localStorage.getItem("film-catalog-favorites")) ?? [];

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
