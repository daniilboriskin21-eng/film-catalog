export function fillMovieForm(movieForm, movie) {
  movieForm.querySelector('[name="title"]').value = movie.title;
  movieForm.querySelector('[name="year"]').value = movie.year;
  movieForm.querySelector('[name="genre"]').value = movie.genre;
  movieForm.querySelector('[name="rating"]').value = movie.rating;
  movieForm.querySelector('[name="poster"]').value = movie.poster;
  movieForm.querySelector('[name="description"]').value = movie.description;
}

// Возвращает функцию восстановления исходного состояния кнопки.
export function setFormPending(form, pendingText) {
  const button = form.querySelector('.movie-form__submit');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = pendingText;
  return () => {
    button.disabled = false;
    button.textContent = originalText;
  };
}
