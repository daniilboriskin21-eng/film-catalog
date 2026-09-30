<?php

header("Content-Type: application/json; charset=utf-8");

$id = $_GET['id'] ?? null;

$validatedId = filter_var($id, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1],
]);

if ($validatedId === false) {
    http_response_code(400);
    echo json_encode(["error" => "Некорректный идентификатор фильма"], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    require_once __DIR__ . '/../../src/database.php';

    $statement = $pdo->prepare(
        'SELECT id, title, "year", genre, rating, poster, "description"
        FROM movies WHERE id = :id'
    );

    $statement->execute(['id' => $validatedId]);
    $movie =$statement->fetch(PDO::FETCH_ASSOC);

    if ($movie === false) {
        http_response_code(404);
        echo json_encode(["error" => "Фильм не найден"], JSON_UNESCAPED_UNICODE);
        exit;
    } else {
        $movie['id'] = (string) $movie['id'];
        echo json_encode($movie, JSON_UNESCAPED_UNICODE);
    }
} catch (Throwable $error) {
    http_response_code(500);
    error_log($error->getMessage());
    echo json_encode(["error" => "Не удалось загрузить фильм"], JSON_UNESCAPED_UNICODE);
}