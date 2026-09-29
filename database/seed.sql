INSERT INTO
    movies (id, title, "year", genre, rating, poster)
VALUES
    (
        1,
        'Интерстеллар',
        2014,
        'Фантастика',
        8.7,
        './assets/images/posters/interstellar.webp'
    ),
    (
        2,
        'Бегущий по лезвию 2049',
        2017,
        'Фантастика',
        8.7,
        './assets/images/posters/blade-runner-2049.webp'
    ),
    (
        3,
        'Атака титанов',
        2013,
        'Аниме',
        8.7,
        './assets/images/posters/AOT.webp'
    ),
    (
        4,
        'Брат 2',
        2000,
        'Боевик',
        8.7,
        './assets/images/posters/brat2.webp'
    ),
    (
        5,
        'Новый Человек-паук',
        2012,
        'Фантастика',
        8.7,
        './assets/images/posters/the-amazing-spider-man.webp'
    ),
    (
        6,
        'Черепашки-ниндзя',
        2014,
        'Фантастика',
        8.7,
        './assets/images/posters/teenage-mutant-ninja-turtles.webp'
    ) ON CONFLICT (id) DO NOTHING;