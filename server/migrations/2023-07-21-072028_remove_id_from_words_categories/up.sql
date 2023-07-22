-- Your SQL goes here
CREATE TABLE words_categories_new (
    word_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(word_id, category_id)
);

INSERT INTO words_categories_new SELECT category_id, word_id, created_at FROM words_categories;

DROP TABLE words_categories;

ALTER TABLE words_categories_new RENAME TO words_categories;