<?php

require_once __DIR__ . '/../src/database.php';

$sql = file_get_contents(__DIR__ . '/schema.sql');

if ($sql === false) throw new Exception("Не удалось прочитать схему базы данных");

$pdo->exec($sql);
echo "Таблица movies готова" . PHP_EOL;

$columns = $pdo->query('PRAGMA table_info(movies)')
    ->fetchAll(PDO::FETCH_ASSOC);

$columnNames = array_column($columns, 'name');

if (!in_array('description', $columnNames, true)) {
    $sqlMigration001 = file_get_contents(__DIR__ . '/migrations/001_add_movie_description.sql');

    if ($sqlMigration001 === false) throw new Exception("Не удалось добавить столбец descriprion");

    $pdo->exec($sqlMigration001);
    echo "Стоблец description добавлен" . PHP_EOL;
}


$seedSql = file_get_contents(__DIR__ . '/seed.sql');

if ($seedSql === false) throw new Exception("Не удалось прочитать начальные данные");

$pdo->exec($seedSql);
echo "Начальные данные загружены" . PHP_EOL;
