const favoriteCount = document.querySelector(".favorites-count");

export function updateFavoriteCount() {
  const favoriteButtons = document.querySelectorAll(".movie-card__favorite");

  let count = 0;
  favoriteButtons.forEach((button) => {
    if (button.getAttribute("aria-pressed") === "true") count++;
  });
  favoriteCount.textContent = String(count);
}

export function loadFavorites() {
  const moviesID = getFavoriteIds();

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

export function getFavoriteIds() {
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

  return moviesID;
}

export function setFavoriteIds(ids) {
  try {
    localStorage.setItem("film-catalog-favorites", JSON.stringify(ids));
  } catch (error) {
    console.warn(
      "Не удалось сохранить избранное. После перезагрузки последние изменения могут потеряться.",
      error,
    );
  }
}

export function toggleFavorite(movieId) {
  movieId = String(movieId);
  let moviesIds = getFavoriteIds();
  let adding;

  if (moviesIds.includes(movieId)) {
    moviesIds = moviesIds.filter((id) => id !== movieId);
    adding = false;
  } else {
    moviesIds.push(movieId);
    adding = true;
  }

  setFavoriteIds(moviesIds);
  return adding;
}

export function pruneFavorites(movies) {
  const movieIds = movies.map((movie) => String(movie.id));

  const favorites = getFavoriteIds();

  const newFavorites = favorites.filter((id) => movieIds.includes(id));

  if (newFavorites.length < favorites.length) setFavoriteIds(newFavorites);
}
