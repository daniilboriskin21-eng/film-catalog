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