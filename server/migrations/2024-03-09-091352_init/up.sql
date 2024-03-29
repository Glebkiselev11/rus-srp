CREATE TABLE words (
  id SERIAL NOT NULL PRIMARY KEY,
  eng VARCHAR NOT NULL,
  rus VARCHAR NOT NULL,
  srp_latin VARCHAR NOT NULL,
  srp_cyrillic VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  image TEXT,
  category_count INTEGER NOT NULL DEFAULT 0
);


CREATE TABLE categories (
  id SERIAL NOT NULL PRIMARY KEY,
  eng VARCHAR NOT NULL,
  rus VARCHAR NOT NULL,
  srp_latin VARCHAR NOT NULL,
  srp_cyrillic VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  image TEXT
);


CREATE TABLE users (
  id SERIAL NOT NULL PRIMARY KEY,
  username VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

