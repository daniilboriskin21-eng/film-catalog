import renderMovies from "./cards.js";
import {
  updateFavoriteCount,
  toggleFavorite,
  loadFavorites,
} from "./favorites.js";
import { itemsFilter } from "./filters.js";

const catalogStatus = document.querySelector(".catalog-status");
let isCatalogReady = false;

let currentMode = "all";
let currentSearch = "";
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentSearch = searchInput.value.trim().toLowerCase();
  if (isCatalogReady) {
    itemsFilter(currentMode, currentSearch);
  }
});

async function loadMovies() {
  isCatalogReady = false;
  catalogStatus.textContent = "Загружаем фильмы...";
  try {
    const response = await fetch("/api/movies.php");

    if (!response.ok) {
      throw new Error(`Статус ответа ${response.status}`);
    }

    const loadedMovies = await response.json();

    renderMovies(loadedMovies);

    const favoriteButtons = document.querySelectorAll(".movie-card__favorite");

    favoriteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const movieItem = button.closest(".movie-list__item");

        const movieId = movieItem.dataset.movieId;
        const isFavorite = toggleFavorite(movieId);
                
        button.setAttribute("aria-pressed", String(isFavorite));

        const icon = button.querySelector("span");
        icon.textContent = isFavorite ? "♥" : "♡";

        updateFavoriteCount();

        itemsFilter(currentMode, currentSearch);
      });
    });

    loadFavorites();
    updateFavoriteCount();

    isCatalogReady = true;
    catalogStatus.textContent = "";

    itemsFilter(currentMode, currentSearch);
  } catch (error) {
    console.error("Не удалось загрузить фильмы", error);
    catalogStatus.textContent =
      "Не удалось загрузить фильмы. Попробуйте обновить страницу.";
  }
}

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
    if (isCatalogReady) {
      itemsFilter(currentMode, currentSearch);
    }
  });
});

loadMovies();
