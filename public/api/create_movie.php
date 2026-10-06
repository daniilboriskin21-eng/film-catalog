<?php

header("Content-Type: application/json; charset=utf-8");

$method = $_SERVER['REQUEST_METHOD'] ?? null;

if ($method !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(["error" => "Метод не разрешен"], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    require_once __DIR__ . '/../../src/session.php';

    if (!isset($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Неавторизованный доступ"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $receivedToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    $sessionToken = $_SESSION['csrf_token'] ?? null;

    if (
        !is_string($receivedToken) ||
        !is_string($sessionToken) ||
        $sessionToken === '' ||
        !hash_equals($sessionToken, $receivedToken)
    ) {
        http_response_code(403);
        echo json_encode(
            ['error' => 'Недействительный токен запроса. Войдите заново.'],
            JSON_UNESCAPED_UNICODE
        );
        exit;
    }

    $title = $_POST['title'] ?? null;
    $year = $_POST['year'] ?? null;
    $genre = $_POST['genre'] ?? null;
    $rating = $_POST['rating'] ?? null;
    $poster = $_POST['poster'] ?? null;
    $description = $_POST['description'] ?? null;

    if (
        !is_string($title) ||
        !is_string($year)  ||
        !is_string($genre)  ||
        !is_string($rating) ||
        !is_string($poster) ||
        !is_string($description)
    ) {
        http_response_code(400);
        echo json_encode(["error" => "Некорректные данные формы"], JSON_UNESCAPED_UNICODE);
        exit;
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
        http_response_code(400);
        echo json_encode(["error" => "Все поля формы должны быть заполнены"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $year = filter_var($year, FILTER_VALIDATE_INT);
    if ($year === false || $year < 1888 || $year > (int)date("Y") + 1) {
        http_response_code(400);
        echo json_encode(["error" => "Некорректный год выпуска"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $rating = filter_var($rating, FILTER_VALIDATE_FLOAT);
    if ($rating === false || $rating < 0 || $rating > 10) {
        http_response_code(400);
        echo json_encode(["error" => "Рейтинг должен быть числом от 0 до 10"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (!preg_match('~\Aassets/images/posters/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)\z~', $poster)) {
        http_response_code(400);
        echo json_encode(["error" => "Укажите путь к постеру: assets/images/posters/имя-файла.jpg"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $posterPath = __DIR__ . '/../' . $poster;
    if (is_file($posterPath) === false) {
        http_response_code(400);
        echo json_encode(["error" => "Файл постера не найден на сервере"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    require_once __DIR__ . '/../../src/database.php';

    $statement = $pdo->prepare('INSERT INTO movies (title, year, genre, rating, poster, description) VALUES (:title, :year, :genre, :rating, :poster, :description)');

    $statement->execute([
        'title' => $title,
        'year' => $year,
        'genre' => $genre,
        'rating' => $rating,
        'poster' => $poster,
        'description' => $description,
    ]);

    $movieId = (int) $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode(["message" => "Фильм добавлен", "id" => $movieId], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    http_response_code(500);
    error_log($error->getMessage());
    echo json_encode(["error" => "Не удалось создать фильм"], JSON_UNESCAPED_UNICODE);
}
