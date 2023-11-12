-- Your SQL goes here
-- First, create a new temporary table
CREATE TABLE categories_temp (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    eng TEXT NOT NULL,
    rus TEXT,
    srp_latin TEXT,
    srp_cyrillic TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Copy the data from the old table to the new table
INSERT INTO categories_temp (id, eng, created_at, updated_at)
SELECT id, name, created_at, updated_at FROM categories;

-- Drop the old table
DROP TABLE categories;

-- Rename the new table to the old table's name
ALTER TABLE categories_temp RENAME TO categories;
