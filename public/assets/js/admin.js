import { getMovies, createMovie } from "./api.js";
import { checkAuth, setupLogout } from "./auth.js";
import { setFormPending } from "./movie-form.js";

const authStatus = document.querySelector(".auth-status");
const movieForm = document.querySelector(".movie-form");
const logoutButton = document.querySelector(".logout-button");
const formStatus = document.querySelector(".form-status");
const createdMovieLink = document.querySelector(".created-movie-link");

const adminMovies = document.querySelector(".admin-movies");
const adminMoviesStatus = document.querySelector(".admin-movies__status");
const adminMoviesList = document.querySelector(".admin-movies__list");
const adminMovieTemplate = document.querySelector(".admin-movie-template");

async function loadAdminMovies() {
  try {
    adminMoviesStatus.textContent = "Загрузка фильмов...";
    const movies = await getMovies();
    renderAdminMovies(movies);
    if (movies.length === 0) {
      adminMoviesStatus.textContent = "Фильмы не найдены.";
    } else {
      adminMoviesStatus.textContent = "";
    }
  } catch (error) {
    adminMoviesStatus.textContent =
      "Не удалось загрузить фильмы. Пожалуйста, попробуйте позже.";
  }
}

function renderAdminMovies(movies) {
  adminMoviesList.replaceChildren();
  movies.forEach((movie) => {
    const movieElement = adminMovieTemplate.content.cloneNode(true);
    movieElement.querySelector(".admin-movie__link").textContent = movie.title;
    movieElement.querySelector(".admin-movie__year").textContent = movie.year;
    movieElement.querySelector(".admin-movie__link").href =
      `./movie.html?id=${movie.id}`;
    movieElement.querySelector(".admin-movie__genre").textContent = movie.genre;
    movieElement.querySelector(".admin-movie__edit-link").href =
      `./edit_movie.html?id=${movie.id}`;
    adminMoviesList.append(movieElement);
  });
}

let csrfToken = null;

movieForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  createdMovieLink.hidden = true;

  const formData = new FormData(movieForm);
  const restoreButton = setFormPending(movieForm, "Добавляем...");
  formStatus.textContent = "Сохраняем фильм...";

  try {
    const data = await createMovie(formData, csrfToken);

    formStatus.textContent = data.message;
    movieForm.reset();

    createdMovieLink.href = `./movie.html?id=${data.id}`;
    createdMovieLink.hidden = false;

    loadAdminMovies();
  } catch (error) {
    formStatus.textContent = error instanceof TypeError ? "Не удалось отправить форму" : error.message;
  } finally {
    restoreButton();
  }
});

setupLogout(logoutButton, authStatus);

async function init() {
  csrfToken = await checkAuth(authStatus, logoutButton);
  if (!csrfToken) return;
  movieForm.hidden = false;
  authStatus.hidden = true;
  adminMovies.hidden = false;
  await loadAdminMovies();
}

init();
