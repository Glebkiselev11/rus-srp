-- This file should undo anything in `up.sql`
CREATE TABLE users_old (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
);

INSERT INTO users_old(id, username, password) 
SELECT CAST(id AS TEXT), username, password 
FROM users;

DROP TABLE users;

ALTER TABLE users_old RENAME TO users;