-- Your SQL goes here
-- Trigger to increment category_count
CREATE TRIGGER increment_category_count
AFTER INSERT ON words_categories
FOR EACH ROW
BEGIN
    UPDATE words
    SET category_count = category_count + 1
    WHERE id = NEW.word_id;
END;

-- Trigger to decrement category_count
CREATE TRIGGER decrement_category_count
AFTER DELETE ON words_categories
FOR EACH ROW
BEGIN
    UPDATE words
    SET category_count = category_count - 1
    WHERE id = OLD.word_id;
END;
