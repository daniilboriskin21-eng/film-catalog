const authStatus = document.querySelector(".auth-status");
const movieForm = document.querySelector(".movie-form");
const logoutButton = document.querySelector(".logout-button");

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
