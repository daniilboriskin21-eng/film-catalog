CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    genre TEXT NOT NULL,
    rating REAL NOT NULL,
    poster TEXT NOT NULL
);