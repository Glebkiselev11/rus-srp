-- Your SQL goes here
CREATE TABLE categories_temp (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  eng TEXT NOT NULL,
  rus TEXT NOT NULL,
  srp_latin TEXT NOT NULL,
  srp_cyrillic TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  image TEXT
);

-- Need to ensure that there are no NULL values in rus, srp_latin, srp_cyrillic in the original table.
INSERT INTO categories_temp
SELECT * FROM categories;

DROP TABLE categories;

ALTER TABLE categories_temp RENAME TO categories;
