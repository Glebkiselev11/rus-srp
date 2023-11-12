-- This file should undo anything in `up.sql`
CREATE TABLE categories_backup (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  eng TEXT NOT NULL,
  rus TEXT,
  srp_latin TEXT,
  srp_cyrillic TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  image TEXT
);

INSERT INTO categories_backup (id, name, created_at, updated_at)
SELECT id, eng, created_at, updated_at FROM categories;

DROP TABLE categories;

ALTER TABLE categories_backup RENAME TO categories;
