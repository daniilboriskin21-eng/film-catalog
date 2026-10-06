const authStatus = document.querySelector(".auth-status");
const movieForm = document.querySelector(".movie-form");
const logoutButton = document.querySelector(".logout-button");
const formStatus = document.querySelector(".form-status");
const createdMovieLink = document.querySelector(".created-movie-link");

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
    }
  } catch (error) {
    authStatus.textContent =
      "Не удалось проверить авторизацию. Обновите страницу";
    authStatus.hidden = false;
  }
}

checkAuth();
