-- This file should undo anything in `up.sql`
CREATE TABLE categories_backup (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name NOT NULL TEXT,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Copy the data from the changed table to the backup
INSERT INTO categories_backup (id, name, created_at, updated_at)
SELECT id, eng, created_at, updated_at FROM categories;

-- Drop the changed table
DROP TABLE categories;

-- Rename the backup table back to the original table's name
ALTER TABLE categories_backup RENAME TO categories;
