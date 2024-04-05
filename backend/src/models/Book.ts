import { database } from "../database/database";

export interface IBook
{
    id: number;
    title: string;
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
            'SELECT id, title, publisher, release, cover FROM books ORDER BY id'
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

    static async create({ title, publisher, release, cover, attachment }: Omit<IBook, 'id'>)
    {
        await database.query(
            'INSERT INTO books (title, publisher, release, cover, attachment) VALUES ($1, $2, $3, $4, $5)',
            [title, publisher, release, cover, attachment]
        );
    }

    static async edit({ id, title, publisher, release, cover, attachment }: IBook)
    {
        await database.query(
            'UPDATE books SET title = $1, publisher = $2, release = $3, cover = $4, attachment = $5 WHERE id = $6', 
            [title, publisher, release, cover, attachment, id]
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
