<?php

header("Content-Type: application/json; charset=utf-8");

$movies = [
    [
        "id" => "1",
        "title" => "Интерстеллар",
        "year" => 2014,
        "genre" => "Фантастика",
        "rating" => 8.7,
        "poster" => "./assets/images/posters/interstellar.webp",
    ],
    [
        "id" => "2",
        "title" => "Бегущий по лезвию 2049",
        "year" => 2017,
        "genre" => "Фантастика",
        "rating" => 8.7,
        "poster" => "./assets/images/posters/blade-runner-2049.webp",
    ],
    [
        "id" => "3",
        "title" => "Атака титанов",
        "year" => 2013,
        "genre" => "Аниме",
        "rating" => 8.7,
        "poster" => "./assets/images/posters/AOT.webp",
    ],
    [
        "id" => "4",
        "title" => "Брат 2",
        "year" => 2000,
        "genre" => "Боевик",
        "rating" => 8.7,
        "poster" => "./assets/images/posters/brat2.webp",
    ],
    [
        "id" => "5",
        "title" => "Новый Человек-паук",
        "year" => 2012,
        "genre" => "Фантастика",
        "rating" => 8.7,
        "poster" => "./assets/images/posters/the-amazing-spider-man.webp",
    ],
    [
        "id" => "6",
        "title" => "Черепашки-ниндзя",
        "year" => 2014,
        "genre" => "Фантастика",
        "rating" => 8.7,
        "poster" => "./assets/images/posters/teenage-mutant-ninja-turtles.webp",
    ],
];

echo json_encode($movies, JSON_UNESCAPED_UNICODE);
