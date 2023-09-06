CREATE TABLE Users (
  id serial PRIMARY KEY,
  username text NOT NULL UNIQUE,
  name text,
  password_hash text NOT NULL
);