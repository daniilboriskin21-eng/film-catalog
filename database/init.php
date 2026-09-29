<?php

require_once __DIR__ . '/../src/database.php';

$sql = file_get_contents(__DIR__ . '/schema.sql');

if ($sql === false) throw new Exception("Не удалось прочитать схему базы данных");

$pdo->exec($sql);
echo "Таблица movies готова" . PHP_EOL;

$seedSql = file_get_contents(__DIR__ . '/seed.sql');

if ($seedSql === false) throw new Exception("Не удалось прочитать начальные данные");

$pdo->exec($seedSql);
echo "Начальные данные загружены" . PHP_EOL;