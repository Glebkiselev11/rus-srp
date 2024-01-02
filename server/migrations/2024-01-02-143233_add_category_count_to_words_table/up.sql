-- Your SQL goes here
ALTER TABLE words
ADD COLUMN category_count INTEGER NOT NULL DEFAULT 0;

-- Update category_count based on existing relationships
UPDATE words
SET category_count = (
    SELECT COUNT(*)
    FROM words_categories
    WHERE words_categories.word_id = words.id
);
