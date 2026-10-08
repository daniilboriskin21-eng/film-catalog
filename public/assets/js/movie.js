import { getFavoriteIds, toggleFavorite } from "./favorites.js";
import { getMovie } from "./api.js";

const favoriteButton = document.querySelector(".movie-details__favorite");

function updateFavoriteButton(isFavorite) {
  favoriteButton.setAttribute("aria-pressed", String(isFavorite));
  favoriteButton.textContent = isFavorite
    ? "Удалить из избранного"
    : "Добавить в избранное";
}

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

const movieStatus = document.querySelector(".movie-status");

async function loadMovie() {
  if (!movieId) {
    movieStatus.textContent = "Не указан идентификатор фильма";
    return;
  }
  movieStatus.textContent = "Загружаем фильм...";
  try {
    const loadedMovie = await getMovie(movieId);
    renderMovie(loadedMovie);

    favoriteButton.addEventListener("click", () => {
      const isFavorite = toggleFavorite(loadedMovie.id);
      updateFavoriteButton(isFavorite);
    });

    movieStatus.textContent = "";
  } catch (error) {
    console.error("Не удалось загрузить фильм", error);
    if (error instanceof TypeError)
      movieStatus.textContent =
        "Не удалось загрузить фильм. Попробуйте обновить страницу";
    else movieStatus.textContent = error.message;
  }
}

function renderMovie(movie) {
  const movieDetails = document.querySelector(".movie-details");

  const titleElement = movieDetails.querySelector(".movie-details__title");
  titleElement.textContent = movie.title;

  const yearElement = movieDetails.querySelector(".movie-details__year");
  yearElement.textContent = movie.year;

  const genreElement = movieDetails.querySelector(".movie-details__genre");
  genreElement.textContent = movie.genre;

  const ratingElement = movieDetails.querySelector(".movie-details__rating");
  ratingElement.textContent = "Рейтинг: " + movie.rating;

  const descriptionElement = movieDetails.querySelector(
    ".movie-details__description",
  );
  descriptionElement.textContent = movie.description;

  const posterElement = movieDetails.querySelector(".movie-details__poster");
  posterElement.src = movie.poster;
  posterElement.alt = "Постер фильма " + movie.title;

  const favoriteIds = getFavoriteIds();
  const isFavorite = favoriteIds.includes(movie.id);
  updateFavoriteButton(isFavorite);

  document.title = movie.title + " - КиноПолка";
  movieDetails.hidden = false;
}

loadMovie();
