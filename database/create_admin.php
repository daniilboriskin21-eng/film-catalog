<?php

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    echo "Доступ запрещен";
    exit;
}

require_once __DIR__ . '/../src/database.php';

echo "Введите логин администратора: ";
$username = trim(fgets(STDIN));

if ($username === '') {
    echo "Логин не может быть пустым" . PHP_EOL;
    exit(1);
}

echo "Введите пароль администратора: ";
$password = rtrim(fgets(STDIN), "\r\n");

if (strlen($password) < 12) {
    echo "Пароль должен содержать не менее 12 символов" . PHP_EOL;
    exit(1);
}

echo "Подтвердите пароль администратора: ";
$passwordConfirm = rtrim(fgets(STDIN), "\r\n");

if ($password !== $passwordConfirm) {
    echo "Введенные пароли не совпадают" . PHP_EOL;
    exit(1);
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
echo "Пароль подготовлен" . PHP_EOL;

try {
    $statement = $pdo->prepare('INSERT INTO admins (username, password_hash) VALUES (:username, :password_hash)');
    $statement->execute([
        ':username' => $username,
        ':password_hash' => $passwordHash,
    ]);
} catch (PDOException $error) {
    if ($error->getCode() === '23000') {
        echo "Администратор с таким логином уже существует" . PHP_EOL;
    } else {
        echo "Ошибка при создании администратора: " . $error->getMessage() . PHP_EOL;
    }
    exit(1);
}

echo "Администратор успешно создан" . PHP_EOL;

// admin qwerty123456
