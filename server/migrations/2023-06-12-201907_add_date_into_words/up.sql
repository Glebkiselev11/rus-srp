-- Your SQL goes here
CREATE TABLE IF NOT EXISTS words_new (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    rus TEXT NOT NULL,
    eng TEXT NOT NULL,
    srp_latin TEXT NOT NULL,
    srp_cyrillic TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

INSERT INTO words_new(id, rus, eng, srp_latin, srp_cyrillic) 
SELECT id, rus, eng, srp_latin, srp_cyrillic FROM words;

DROP TABLE words;

ALTER TABLE words_new RENAME TO words;