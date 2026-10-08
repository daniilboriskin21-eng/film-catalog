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
    const response = await fetch("/api/movies.php");
    if (response.ok === false) {
      adminMoviesStatus.textContent =
        "Ошибка загрузки фильмов. Пожалуйста, попробуйте позже.";
      return;
    }
    const movies = await response.json();
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

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;
  try {
    const response = await fetch("/api/logout.php", { method: "POST" });
    if (response.ok === false) {
      authStatus.textContent =
        "Ошибка выхода из системы. Пожалуйста, попробуйте позже.";
      authStatus.hidden = false;
      return;
    }
    if (response.ok) {
      window.location.replace("/login.html");
    }
  } catch (error) {
    authStatus.textContent =
      "Не удалось выполнить выход. Пожалуйста, попробуйте позже.";
    authStatus.hidden = false;
    return;
  } finally {
    logoutButton.disabled = false;
  }
});

movieForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  createdMovieLink.hidden = true;

  const formData = new FormData(movieForm);
  const submitButton = movieForm.querySelector(".movie-form__submit");

  submitButton.disabled = true;
  submitButton.textContent = "Добавляем...";
  formStatus.textContent = "Сохраняем фильм...";

  try {
    const response = await fetch("./api/create_movie.php", {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok === false) {
      formStatus.textContent = data.error;
    } else {
      formStatus.textContent = data.message;
      movieForm.reset();

      createdMovieLink.href = `./movie.html?id=${data.id}`;
      createdMovieLink.hidden = false;

      loadAdminMovies();
    }
  } catch (error) {
    formStatus.textContent = "Не удалось отправить форму";
  } finally {
    submitButton.disabled = false;

    submitButton.textContent = "Добавить фильм";
  }
});

async function checkAuth() {
  try {
    const response = await fetch("/api/session.php");
    if (response.ok === false) {
      authStatus.textContent =
        "Ошибка проверки авторизации. Пожалуйста, попробуйте позже.";
      return;
    }
    const data = await response.json();
    if (data.authenticated === false) {
      window.location.replace("/login.html");
      return;
    }
    if (data.authenticated === true) {
      if (typeof data.csrfToken === "string" && data.csrfToken.length > 0) {
        csrfToken = data.csrfToken;
      } else {
        logoutButton.hidden = false;
        authStatus.textContent = "Выйдите и войдите снова, чтобы продолжить";
        return;
      }
      movieForm.hidden = false;
      authStatus.hidden = true;
      logoutButton.hidden = false;
      adminMovies.hidden = false;
      loadAdminMovies();
    }
  } catch (error) {
    authStatus.textContent =
      "Не удалось проверить авторизацию. Обновите страницу";
    authStatus.hidden = false;
  }
}

checkAuth();
