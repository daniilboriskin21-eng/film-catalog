const emptyMessage = document.querySelector(".empty-message");

export function itemsFilter(currentMode, currentSearch) {
  const items = document.querySelectorAll(".movie-list__item");
  let visibleCount = 0;

  items.forEach((item) => {
    const button = item.querySelector(".movie-card__favorite");
    const isFavorite = button.getAttribute("aria-pressed") === "true";

    const title = item
      .querySelector(".movie-card__title")
      .textContent.toLowerCase();

    const isHidden =
      (currentMode === "favorites" && !isFavorite) ||
      !title.includes(currentSearch);

    item.hidden = isHidden;
    visibleCount += !isHidden ? 1 : 0;
  });

  if (visibleCount === 0) {
    emptyMessage.hidden = false;
    if (currentSearch) {
      emptyMessage.textContent = "По вашему запросу ничего не найдено";
    } else if (currentMode === "favorites") {
      emptyMessage.textContent = "В избранном пока ничего нет";
    } else {
      emptyMessage.textContent = "В каталоге пока нет фильмов";
    }
  } else {
    emptyMessage.hidden = true;
  }
}