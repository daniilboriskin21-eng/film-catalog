import { getMovie } from "./api.js";

const authStatus = document.querySelector(".auth-status");
const formStatus = document.querySelector(".form-status");
const logoutButton = document.querySelector(".logout-button");
const movieForm = document.querySelector(".movie-form");

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

let csrfToken = null;

async function loadMovie() {
  if (!movieId) {
    authStatus.textContent = "Не указан фильм для редактирования";
    return;
  }

  try {
    authStatus.textContent = "Загружаем фильм...";
    const movie = await getMovie(movieId);
    fillMovieForm(movie);
    movieForm.hidden = false;
    authStatus.hidden = true;
  } catch (error) {
    console.error("Не удалось загрузить фильм", error);
    if (error instanceof TypeError)
      authStatus.textContent =
        "Не удалось загрузить фильм. Попробуйте обновить страницу";
    else authStatus.textContent = error.message;
  }
}

function fillMovieForm(movie) {
  movieForm.querySelector('[name="title"]').value = movie.title;
  movieForm.querySelector('[name="year"]').value = movie.year;
  movieForm.querySelector('[name="genre"]').value = movie.genre;
  movieForm.querySelector('[name="rating"]').value = movie.rating;
  movieForm.querySelector('[name="poster"]').value = movie.poster;
  movieForm.querySelector('[name="description"]').value = movie.description;
}

movieForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(movieForm);
  formData.set("id", movieId);
  
  const submitButton = document.querySelector(".movie-form__submit");

  submitButton.disabled = true;
  submitButton.textContent = "Сохраняем...";
  formStatus.textContent = "Сохраняем изменения...";

  try {
    const response = await fetch("./api/update_movie.php", {
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
    }
  } catch (error) {
    formStatus.textContent = "Не удалось сохранить изменения";
  } finally {
    submitButton.disabled = false;

    submitButton.textContent = "Сохранить изменения";
  }
});

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
      //   movieForm.hidden = false;
      //   authStatus.hidden = true;
      logoutButton.hidden = false;
      loadMovie();
    }
  } catch (error) {
    authStatus.textContent =
      "Не удалось проверить авторизацию. Обновите страницу";
    authStatus.hidden = false;
  }
}

checkAuth();
