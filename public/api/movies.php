<?php

require_once __DIR__ . '/../../src/database.php';

header("Content-Type: application/json; charset=utf-8");

$statement = $pdo->query(
    'SELECT id, title, "year", genre, rating, poster FROM movies ORDER BY id'
);

$movies = $statement->fetchAll(PDO::FETCH_ASSOC);

foreach ($movies as $index => $movie) {
    $movies[$index]['id'] = (string) $movie['id'];
}

echo json_encode($movies, JSON_UNESCAPED_UNICODE);
