<?php

// Возвращает очищенные поля или сообщает об ошибке входных данных.
function validateMovieData(array $data): array
{
    $title = $data['title'] ?? null;
    $year = $data['year'] ?? null;
    $genre = $data['genre'] ?? null;
    $rating = $data['rating'] ?? null;
    $poster = $data['poster'] ?? null;
    $description = $data['description'] ?? null;

    if (
        !is_string($title) ||
        !is_string($year)  ||
        !is_string($genre)  ||
        !is_string($rating) ||
        !is_string($poster) ||
        !is_string($description)
    ) {
        throw new InvalidArgumentException("Некорректные данные формы");
    }

    $title = trim($title);
    $year = trim($year);
    $genre = trim($genre);
    $rating = trim($rating);
    $poster = trim($poster);
    $description = trim($description);

    if (
        $title === '' ||
        $year === '' ||
        $genre === '' ||
        $rating === '' ||
        $poster === '' ||
        $description === ''
    ) {
        throw new InvalidArgumentException("Все поля формы должны быть заполнены");
    }

    $year = filter_var($year, FILTER_VALIDATE_INT);
    if ($year === false || $year < 1888 || $year > (int)date("Y") + 1) {
        throw new InvalidArgumentException("Некорректный год выпуска");
    }

    $rating = filter_var($rating, FILTER_VALIDATE_FLOAT);
    if ($rating === false || $rating < 0 || $rating > 10) {
        throw new InvalidArgumentException("Рейтинг должен быть числом от 0 до 10");
    }

    if (str_starts_with($poster, './')) {
        $poster = substr($poster, 2);
    }

    if (!preg_match('~\Aassets/images/posters/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)\z~', $poster)) {
        throw new InvalidArgumentException("Укажите путь к постеру: assets/images/posters/имя-файла.jpg");
    }

    $posterPath = __DIR__ . '/../public/' . $poster;
    if (is_file($posterPath) === false) {
        throw new InvalidArgumentException("Файл постера не найден на сервере");
    }

    return compact('title', 'year', 'genre', 'rating', 'poster', 'description');
}
