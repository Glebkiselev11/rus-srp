-- This file should undo anything in `up.sql`
CREATE TABLE words_categories_new (
    word_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(word_id, category_id)
);

INSERT INTO words_categories_new SELECT * FROM words_categories;

DROP TABLE words_categories;

ALTER TABLE words_categories_new RENAME TO words_categories;
