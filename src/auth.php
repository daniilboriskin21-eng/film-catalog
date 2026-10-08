<?php

require_once __DIR__ . '/session.php';

// Проверки для API, изменяющих фильмы.
function requireAdminWithCsrf(): void
{
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

}
