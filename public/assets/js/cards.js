const cardTemplate = document
  .querySelector("#movie-card-template")
  .content.querySelector(".movie-list__item");
const movieList = document.querySelector(".movie-list");

function createMovieCard(movie) {
  const card = cardTemplate.cloneNode(true);

  card.dataset.movieId = movie.id;

  const titleElement = card.querySelector(".movie-card__title");
  titleElement.textContent = movie.title;

  const yearElement = card.querySelector(".movie-card__year");
  yearElement.textContent = movie.year;

  const genreElement = card.querySelector(".movie-card__genre");
  genreElement.textContent = movie.genre;

  const ratingValueElement = card.querySelector(".movie-card__rating-value");
  ratingValueElement.textContent = movie.rating;

  const posterElement = card.querySelector(".movie-card__poster");
  posterElement.src = movie.poster;
  posterElement.alt = "Постер фильма " + movie.title;

  const buttonElement = card.querySelector(".movie-card__favorite");
  buttonElement.setAttribute("aria-label", "Избранное: " + movie.title);

  return card;
}

function renderMovies(movieData) {
  movieList.replaceChildren();

  movieData.forEach((movie) => {
    movieList.append(createMovieCard(movie));
  });
}

export default renderMovies;