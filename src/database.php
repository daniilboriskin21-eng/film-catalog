<?php

$databasePath = __DIR__ . '/../storage/films.sqlite';

$pdo = new PDO('sqlite:' . $databasePath);