CREATE TABLE books
(
    id serial PRIMARY KEY NOT NULL,
    title character varying NOT NULL,
    publisher character varying NOT NULL,
    release date NOT NULL,
    cover character varying,
    attachment character varying
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

CREATE TABLE authors
(
    id serial PRIMARY KEY NOT NULL,
    label character varying NOT NULL
);

CREATE TABLE book_authors
(
    id serial PRIMARY KEY NOT NULL,
    id_book integer REFERENCES books(id),
    id_author integer REFERENCES authors(id)
);

/* To otimize looking for the file type on the 'books' table. */
CREATE INDEX idx_attachment_type ON books (left(attachment, 30));