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

UPDATE movies
SET "description" = 'Отец летит к звёздам ради будущего детей — и всего человечества. Космическая одиссея Кристофера Нолана'
WHERE id = 1 AND "description" = '';

UPDATE movies
SET "description" = 'Полицейский ищет Рика Декарда, пропавшего 30 лет назад. Красивый сиквел культового сай-фая от Дени Вильнёва'
WHERE id = 2 AND "description" = '';

UPDATE movies
SET "description" = 'Люди сражаются с титанами, которые мечтают их съесть. Самое эпичное аниме современности'
WHERE id = 3 AND "description" = '';

UPDATE movies
SET "description" = 'Американцы знакомятся с Данилой Багровым и узнают, в чём сила. Сиквел о герое времени с мощным рок-саундтреком'
WHERE id = 4 AND "description" = '';

UPDATE movies
SET "description" = 'Укус паука — и жизнь подростка меняется навсегда. Первая часть супергеройской дилогии с Эндрю Гарфилдом'
WHERE id = 5 AND "description" = '';

UPDATE movies
SET "description" = 'Черепашки спасают мир от ядовитого мутагена. Бодрая экранизация боевика о приключениях героев из канализации'
WHERE id = 6 AND "description" = '';