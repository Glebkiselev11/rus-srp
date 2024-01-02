-- This file should undo anything in `up.sql`
CREATE TABLE IF NOT EXISTS words_old (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    rus TEXT NOT NULL,
    eng TEXT NOT NULL,
    srp_latin TEXT NOT NULL,
    srp_cyrillic TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    image TEXT
);

INSERT INTO words_old SELECT id, rus, eng, srp_latin, srp_cyrillic, created_at, updated_at, image FROM words;

DROP TABLE words;

ALTER TABLE words_old RENAME TO words;