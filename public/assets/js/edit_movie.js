import { getMovie, updateMovie } from "./api.js";
import { checkAuth, setupLogout } from "./auth.js";
import { fillMovieForm, setFormPending } from "./movie-form.js";

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
    fillMovieForm(movieForm, movie);
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

movieForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(movieForm);
  formData.set("id", movieId);
  
  const restoreButton = setFormPending(movieForm, "Сохраняем...");
  formStatus.textContent = "Сохраняем изменения...";

  try {
    const data = await updateMovie(formData, csrfToken);

    formStatus.textContent = data.message;
  } catch (error) {
    formStatus.textContent = error instanceof TypeError ? "Не удалось сохранить изменения" : error.message;
  } finally {
    restoreButton();
  }
});

setupLogout(logoutButton, authStatus);

async function init() {
  csrfToken = await checkAuth(authStatus, logoutButton);
  if (!csrfToken) return;
  await loadMovie();
}

init();
