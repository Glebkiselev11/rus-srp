-- Your SQL goes here
CREATE TABLE words_categories (
  word_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(word_id, category_id),
  CONSTRAINT fk_word_id FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
  CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);