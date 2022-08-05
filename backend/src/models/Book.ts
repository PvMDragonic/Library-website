import { database } from "../database/database";

export interface IBook
{
    id: number;
    title: string;
    author: string;
    publisher: string;
    pages: number;
}

export class Book
{
    static async showAll()
    {
        const query = await database.query('SELECT * FROM books ORDER BY id');
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

    static async create({ title, author, publisher, pages }: Omit<IBook, 'id'>)
    {
        await database.query(
            'INSERT INTO books (title, author, publisher, pages) VALUES ($1, $2, $3, $4)',
            [title, author, publisher, pages]
        );
    }

    static async edit({ id, title, author, publisher, pages }: IBook)
    {
        await database.query(
            'UPDATE books SET title = $1, author = $2, publisher = $3, pages = $4 WHERE id = $5', 
            [title, author, publisher, pages, id]
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
