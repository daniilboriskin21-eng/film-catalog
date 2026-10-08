import { getSession, logout } from "./api.js";

export function setupLogout(logoutButton, authStatus) {
  logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;
    try {
      await logout();
      window.location.replace("/login.html");
    } catch (error) {
      authStatus.textContent =
        error instanceof TypeError
          ? "Не удалось выполнить выход. Пожалуйста, попробуйте позже."
          : error.message;
      authStatus.hidden = false;
      return;
    } finally {
      logoutButton.disabled = false;
    }
  });
}

export async function checkAuth(authStatus, logoutButton) {
  try {
    const data = await getSession();
    if (data.authenticated === false) {
      window.location.replace("/login.html");
      return;
    }
    if (data.authenticated === true) {
      if (typeof data.csrfToken !== "string" || data.csrfToken.length === 0) {
        logoutButton.hidden = false;
        authStatus.textContent = "Выйдите и войдите снова, чтобы продолжить";
        return;
      }
      logoutButton.hidden = false;
      return data.csrfToken;
    }
  } catch (error) {
    authStatus.textContent =
      error instanceof TypeError
        ? "Не удалось проверить авторизацию. Обновите страницу"
        : error.message;
    authStatus.hidden = false;
  }
}


