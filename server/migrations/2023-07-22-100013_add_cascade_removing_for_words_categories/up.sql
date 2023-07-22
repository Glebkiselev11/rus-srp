-- Your SQL goes here
CREATE TABLE words_categories_new (
    word_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(word_id, category_id),
    -- This constrains doesn't work
    CONSTRAINT fk_words FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
    CONSTRAINT fk_categories FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

INSERT INTO words_categories_new SELECT * FROM words_categories;

DROP TABLE words_categories;

ALTER TABLE words_categories_new RENAME TO words_categories;


