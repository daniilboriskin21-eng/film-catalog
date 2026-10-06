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

    $_SESSION = [];

    $params = session_get_cookie_params();

    setcookie(session_name(), '', [
        'expires' => time() - 3600,
        'path' => $params['path'],
        'domain' => $params['domain'],
        'secure' => $params['secure'],
        'httponly' => $params['httponly'],
        'samesite' => $params['samesite'],
    ]);

    session_destroy();

    echo json_encode(["message" => "Выход выполнен успешно"], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    http_response_code(500);
    error_log($error->getMessage());
    echo json_encode(["error" => "Не удалось выполнить выход"], JSON_UNESCAPED_UNICODE);
}
