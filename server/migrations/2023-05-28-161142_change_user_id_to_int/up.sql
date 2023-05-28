-- Your SQL goes here

CREATE TABLE users_new (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

INSERT INTO users_new(username, password) 
SELECT username, password 
FROM users;

DROP TABLE users;

ALTER TABLE users_new RENAME TO users;
