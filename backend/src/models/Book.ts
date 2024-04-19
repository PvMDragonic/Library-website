import { database } from "../database/database";

export interface IBook
{
    id: number;
    title: string;
    author: string;
    publisher: string;
    release: Date;
    cover: string;
    attachment: string;
}

export class Book
{
    static async showAll()
    {
        const query = await database.query(
            'SELECT id, title, author, publisher, release, cover FROM books ORDER BY id'
        );
        return query.rows;
    }

    static async searchByTitle(title: string)
    {
        const query = await database.query(
            'SELECT * FROM books WHERE title = $1', 
            [title]
        );
        return query.rows;
    }

    static async searchById(id: number)
    {
        const query = await database.query(
            'SELECT * FROM books WHERE id = $1', 
            [id]
        );
        return query.rows;
    }

    static async create({ title, author, publisher, release, cover, attachment }: Omit<IBook, 'id'>)
    {
        await database.query(
            'INSERT INTO books (title, author, publisher, release, cover, attachment) VALUES ($1, $2, $3, $4, $5, $6)',
            [title, author, publisher, release, cover, attachment]
        );
    }

    static async edit({ id, title, author, publisher, release, cover, attachment }: IBook)
    {
        await database.query(
            'UPDATE books SET title = $1, author = $2, publisher = $3, release = $4, cover = $5, attachment = $6 WHERE id = $7', 
            [title, author, publisher, release, cover, attachment, id]
        );
    }

    static async delete(id: number)
    {
        await database.query(
            'DELETE FROM books WHERE id = $1', 
            [id]
        );
    }
}
