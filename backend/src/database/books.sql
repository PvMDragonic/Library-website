CREATE TABLE books
(
    id serial PRIMARY KEY NOT NULL,
    title character varying NOT NULL,
    author character varying NOT NULL,
    publisher character varying NOT NULL,
    pages integer NOT NULL
);