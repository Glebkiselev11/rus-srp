-- This file should undo anything in `up.sql`
-- Drop the trigger to increment category_count
DROP TRIGGER IF EXISTS increment_category_count ON words_categories;

-- Drop the trigger function for incrementing category_count
DROP FUNCTION IF EXISTS increment_category_count_trigger();

-- Drop the trigger to decrement category_count
DROP TRIGGER IF EXISTS decrement_category_count ON words_categories;

-- Drop the trigger function for decrementing category_count
DROP FUNCTION IF EXISTS decrement_category_count_trigger();