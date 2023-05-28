CREATE TABLE words_new (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  rus VARCHAR NOT NULL,
  eng VARCHAR NOT NULL,
  srp_latin VARCHAR NOT NULL,
  srp_cyrillic VARCHAR NOT NULL 
);

INSERT INTO words_new(rus, eng, srp_latin, srp_cyrillic) 
SELECT rus, eng, srp_latin, srp_cyrillic 
FROM words;

DROP TABLE words;

ALTER TABLE words_new RENAME TO words;