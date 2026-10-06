<?php

header("Content-Type: application/json; charset=utf-8");

$method = $_SERVER['REQUEST_METHOD'] ?? '';

if ($method !== 'GET') {
    http_response_code(405);
    header('Allow: GET');

    echo json_encode(
        ['error' => 'Метод не разрешен'],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}

try {
    require_once __DIR__ . '/../../src/session.php';

    if (isset($_SESSION['admin_id'])) {
        echo json_encode(
            ['authenticated' => true],
            JSON_UNESCAPED_UNICODE
        );
    } else {
        echo json_encode(
            ['authenticated' => false],
            JSON_UNESCAPED_UNICODE
        );
    }
} catch (Throwable $error) {
    http_response_code(500);
    error_log($error->getMessage());
    echo json_encode(
        ['error' => 'Не удалось проверить авторизацию'],
        JSON_UNESCAPED_UNICODE
    );
}