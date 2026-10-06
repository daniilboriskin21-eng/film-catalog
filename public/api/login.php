<?php

header("Content-Type: application/json; charset=utf-8");

$method = $_SERVER['REQUEST_METHOD'] ?? null;

if ($method !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(["error" => "Метод не разрешен"], JSON_UNESCAPED_UNICODE);
    exit;
}

$username = $_POST['username'] ?? null;
$password = $_POST['password'] ?? null;

if (is_string($username) === false || is_string($password) === false) {
    http_response_code(400);
    echo json_encode(["error" => "Некорректные данные формы"], JSON_UNESCAPED_UNICODE);
    exit;
}

$username = trim($username);

if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(["error" => "Поля формы не могут быть пустыми"], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    require_once __DIR__ . '/../../src/session.php';
    require_once __DIR__ . '/../../src/database.php';

    $statement = $pdo->prepare(
        'SELECT id, username, password_hash FROM admins WHERE username = :username'
    );

    $statement->execute(['username' => $username]);
    $admin = $statement->fetch(PDO::FETCH_ASSOC);

    if ($admin === false || password_verify($password, $admin['password_hash']) === false) {
        http_response_code(401);
        echo json_encode(["error" => "Неверное имя пользователя или пароль"], JSON_UNESCAPED_UNICODE);
        exit;
    } else {
        session_regenerate_id(true);
        $_SESSION['admin_id'] = (int) $admin['id'];
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        echo json_encode(["message" => "Авторизация успешна"], JSON_UNESCAPED_UNICODE);
    }
} catch (Throwable $error) {
    http_response_code(500);
    error_log($error->getMessage());
    echo json_encode(["error" => "Не удалось выполнить авторизацию"], JSON_UNESCAPED_UNICODE);
}
