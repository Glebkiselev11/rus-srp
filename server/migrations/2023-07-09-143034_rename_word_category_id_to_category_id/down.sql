-- This file should undo anything in `up.sql`
ALTER TABLE words_categories RENAME COLUMN category_id TO word_category_id;