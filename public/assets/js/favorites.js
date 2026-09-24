const favoriteCount = document.querySelector(".favorites-count");

export function updateFavoriteCount() {
  const favoriteButtons = document.querySelectorAll(".movie-card__favorite");

  let count = 0;
  favoriteButtons.forEach((button) => {
    if (button.getAttribute("aria-pressed") === "true") count++;
  });
  favoriteCount.textContent = String(count);
}

export function saveFavorites() {
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

export function loadFavorites() {
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
