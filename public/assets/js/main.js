import { movies } from "./movies.js";
import renderMovies from "./cards.js";
import {
  updateFavoriteCount,
  saveFavorites,
  loadFavorites,
} from "./favorites.js";
import { itemsFilter } from "./filters.js";

let currentMode = "all";
let currentSearch = "";
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentSearch = searchInput.value.trim().toLowerCase();
  itemsFilter(currentMode, currentSearch);
});

const modeButtons = document.querySelectorAll(".catalog-nav__button");

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentMode = button.dataset.filter;

    modeButtons.forEach((element) => {
      element.setAttribute(
        "aria-pressed",
        currentMode === element.dataset.filter,
      );
    });

    itemsFilter(currentMode, currentSearch);
  });
});

renderMovies(movies);

const favoriteButtons = document.querySelectorAll(".movie-card__favorite");

favoriteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isFavorite = button.getAttribute("aria-pressed") === "true";

    button.setAttribute("aria-pressed", String(!isFavorite));

    const icon = button.querySelector("span");
    icon.textContent = isFavorite ? "♡" : "♥";

    updateFavoriteCount();

    itemsFilter(currentMode, currentSearch);

    saveFavorites();
  });
});

loadFavorites();
updateFavoriteCount();
itemsFilter(currentMode, currentSearch);
