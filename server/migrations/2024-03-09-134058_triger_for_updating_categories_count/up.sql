-- Your SQL goes here
-- Trigger function to increment category_count
CREATE OR REPLACE FUNCTION increment_category_count_trigger()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE words
    SET category_count = category_count + 1
    WHERE id = NEW.word_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to attach the increment_category_count_trigger function after INSERT on words_categories
CREATE TRIGGER increment_category_count
AFTER INSERT ON words_categories
FOR EACH ROW
EXECUTE FUNCTION increment_category_count_trigger();

-- Trigger function to decrement category_count
CREATE OR REPLACE FUNCTION decrement_category_count_trigger()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE words
    SET category_count = category_count - 1
    WHERE id = OLD.word_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to attach the decrement_category_count_trigger function after DELETE on words_categories
CREATE TRIGGER decrement_category_count
AFTER DELETE ON words_categories
FOR EACH ROW
EXECUTE FUNCTION decrement_category_count_trigger();