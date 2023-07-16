-- Your SQL goes here
CREATE TABLE users_new (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- Copy all data from the old table to the new table
-- INSERT INTO users_new SELECT * FROM users;

INSERT INTO users_new(id, username, password) 
SELECT id, username, password FROM users;

-- Drop the old table
DROP TABLE users;

-- Rename the new table to the original table name
ALTER TABLE users_new RENAME TO users;