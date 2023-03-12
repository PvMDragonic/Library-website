CREATE TABLE books
(
    id serial PRIMARY KEY NOT NULL,
    title character varying NOT NULL,
    author character varying NOT NULL,
    publisher character varying NOT NULL,
    pages integer NOT NULL
);

CREATE TABLE tags
(
    id serial PRIMARY KEY NOT NULL,
    label character varying NOT NULL,
    color character varying NOT NULL
);

CREATE TABLE book_tags
(
    id serial PRIMARY KEY NOT NULL,
    id_book integer REFERENCES books(id),
    id_tag integer REFERENCES tags(id)
);