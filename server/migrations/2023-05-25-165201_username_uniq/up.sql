-- Create a new table with the UNIQUE constraint
CREATE TABLE users_new (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Copy all data from the old table to the new table
INSERT INTO users_new SELECT * FROM users;

-- Drop the old table
DROP TABLE users;

-- Rename the new table to the original table name
ALTER TABLE users_new RENAME TO users;