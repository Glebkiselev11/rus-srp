-- This file should undo anything in `up.sql`
CREATE TABLE words_old (
  id VARCHAR NOT NULL PRIMARY KEY,
  rus VARCHAR NOT NULL,
  eng VARCHAR NOT NULL,
  srp_latin VARCHAR NOT NULL,
  srp_cyrillic VARCHAR NOT NULL 
);

INSERT INTO words_old(id, rus, eng, srp_latin, srp_cyrillic) 
SELECT CAST(id AS VARCHAR), rus, eng, srp_latin, srp_cyrillic 
FROM words;

DROP TABLE words;

ALTER TABLE words_old RENAME TO words;

