<?php

header("Content-Type: application/json; charset=utf-8");

try {
    require_once __DIR__ . '/../../src/database.php';

    $statement = $pdo->query(
        'SELECT id, title, "year", genre, rating, poster FROM movies ORDER BY id'
    );

    $movies = $statement->fetchAll(PDO::FETCH_ASSOC);

    foreach ($movies as $index => $movie) {
        $movies[$index]['id'] = (string) $movie['id'];
    }

    echo json_encode($movies, JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    http_response_code(500);
    error_log($error->getMessage());

    echo json_encode(["error" => "Не удалось загрузить фильмы"], JSON_UNESCAPED_UNICODE);
}
