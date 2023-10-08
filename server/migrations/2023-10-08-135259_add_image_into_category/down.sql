-- This file should undo anything in `up.sql`
CREATE TABLE IF NOT EXISTS categories_old (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    rus TEXT NOT NULL,
    eng TEXT,
    srp_latin TEXT,
    srp_cyrillic TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

INSERT INTO categories_old SELECT id, rus, eng, srp_latin, srp_cyrillic, created_at, updated_at FROM categories;

DROP TABLE categories;

ALTER TABLE categories_old RENAME TO categories;