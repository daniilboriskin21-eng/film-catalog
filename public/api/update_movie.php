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

    $id = $_POST['id'] ?? null;

    $validatedId = filter_var($id, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1],
    ]);

    if ($validatedId === false) {
        http_response_code(400);
        echo json_encode(
            ['error' => 'Некорректный идентификатор фильма'],
            JSON_UNESCAPED_UNICODE
        );
        exit;
    }

    $movie = validateMovieData($_POST);

    require_once __DIR__ . '/../../src/database.php';

    $statement = $pdo->prepare('SELECT id FROM movies WHERE id = :id');

    $statement->execute([
        'id' => $validatedId,
    ]);

    $existingMovie = $statement->fetch(PDO::FETCH_ASSOC);

    if ($existingMovie === false) {
        http_response_code(404);
        echo json_encode(["error" => "Фильм не найден"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $updateStatement = $pdo->prepare('UPDATE movies
    SET title = :title,
    "year" = :year,
    genre = :genre,
    rating = :rating,
    poster = :poster,
    description = :description
    WHERE id = :id
    ');

    $updateStatement->execute([...$movie, 'id' => $validatedId]);

    http_response_code(200);
    echo json_encode(["message" => "Изменения сохранены", "id" => $validatedId], JSON_UNESCAPED_UNICODE);
} catch (InvalidArgumentException $error) {
    http_response_code(400);
    echo json_encode(["error" => $error->getMessage()], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    http_response_code(500);
    error_log($error->getMessage());
    echo json_encode(["error" => "Не удалось изменить фильм"], JSON_UNESCAPED_UNICODE);
}
