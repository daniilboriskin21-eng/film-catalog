const loginForm = document.querySelector(".login-form");
const formStatus = document.querySelector(".form-status");
const submitButton = loginForm.querySelector(".login-form__submit");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  try {
    formStatus.textContent = "Выполняется вход…";
    submitButton.disabled = true;
    submitButton.textContent = "Входим…";

    const response = await fetch("./api/login.php", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      formStatus.textContent = data.message || "Вход выполнен успешно";
      window.location.replace("./admin.html");
    } else {
      formStatus.textContent = data.error || "Произошла ошибка";
    }
  } catch (error) {
    formStatus.textContent = "Не удалось выполнить вход. Попробуйте ещё раз";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Войти";
  }
});
