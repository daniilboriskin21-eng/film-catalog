export async function getMovie(id) {
    const response = await fetch(`/api/movie.php?id=${encodeURIComponent(id)}`);

    if (response.status === 400) {
      throw new Error("Некорректный идентификатор фильма");
    }
    if (response.status === 404) {
      throw new Error ("Фильм не найден");
    }
    if (!response.ok) {
      throw new Error("Не удалось загрузить фильм");
    }

    const loadedMovie = await response.json();

    return loadedMovie;
    
}
// Общие запросы не обращаются к элементам страницы.
export async function getSession() {
  const response = await fetch('/api/session.php');
  if (!response.ok) throw new Error('Ошибка проверки авторизации. Пожалуйста, попробуйте позже.');
  return response.json();
}

export async function logout() {
  const response = await fetch('/api/logout.php', { method: 'POST' });
  if (!response.ok) throw new Error('Ошибка выхода из системы. Пожалуйста, попробуйте позже.');
}

export async function getMovies() {
  const response = await fetch('/api/movies.php');
  if (!response.ok) throw new Error('Ошибка загрузки фильмов. Пожалуйста, попробуйте позже.');
  return response.json();
}

async function saveMovie(url, formData, csrfToken) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'X-CSRF-Token': csrfToken },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Не удалось сохранить фильм');
  return data;
}

export function createMovie(formData, csrfToken) {
  return saveMovie('/api/create_movie.php', formData, csrfToken);
}

export function updateMovie(formData, csrfToken) {
  return saveMovie('/api/update_movie.php', formData, csrfToken);
}
