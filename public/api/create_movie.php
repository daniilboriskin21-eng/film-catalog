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
    require_once __DIR__ . '/../../src/auth.php';
    require_once __DIR__ . '/../../src/movie_validation.php';

    requireAdminWithCsrf();

    $movie = validateMovieData($_POST);

    require_once __DIR__ . '/../../src/database.php';

    $statement = $pdo->prepare('INSERT INTO movies (title, year, genre, rating, poster, description) VALUES (:title, :year, :genre, :rating, :poster, :description)');

    $statement->execute($movie);

    $movieId = (int) $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode(["message" => "Фильм добавлен", "id" => $movieId], JSON_UNESCAPED_UNICODE);
} catch (InvalidArgumentException $error) {
    http_response_code(400);
    echo json_encode(["error" => $error->getMessage()], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    http_response_code(500);
    error_log($error->getMessage());
    echo json_encode(["error" => "Не удалось создать фильм"], JSON_UNESCAPED_UNICODE);
}
