import { database } from "../database/database";

export interface IBook
{
    id: number;
    title: string;
    publisher: string;
    release: Date;
    cover: string;
    attachment: string;
    progress: string;
}

export class Book
{
    static async showAll()
    {
        const query = await database.query(
            `SELECT 
                id, 
                title, 
                publisher, 
                release, 
                cover,
                CASE 
                    WHEN left(attachment, 30) LIKE 'data:application/pdf%' THEN 'pdf'
                    WHEN left(attachment, 30) LIKE 'data:application/epub%' THEN 'epub'
                    ELSE ''
                END AS type
            FROM books
            ORDER BY id;`
        );
        return query.rows;
    }

    static async searchByAuthor(author: string)
    {
        const query = await database.query(
            `SELECT 
                b.*
            FROM 
                books b
            JOIN 
                book_authors ba ON ba.id_book = b.id
            JOIN 
                authors a ON a.id = ba.id_author
            WHERE 
                a.label = $1`, 
            [author]
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

    static async create({ title, publisher, release, cover, attachment }: Omit<IBook, 'id' | 'progress'>)
    {
        await database.query(
            'INSERT INTO books (title, publisher, release, cover, attachment, progress) VALUES ($1, $2, $3, $4, $5, $6)',
            [title, publisher, release, cover, attachment, 0]
        );
    }

    static async edit({ id, title, publisher, release, cover, attachment }: Omit<IBook, 'progress'>)
    {
        await database.query(
            'UPDATE books SET title = $1, publisher = $2, release = $3, cover = $4, attachment = $5 WHERE id = $6', 
            [title, publisher, release, cover, attachment, id]
        );
    }

    static async updateProgress({ id, progress }: Omit<IBook, 'title' | 'publisher' | 'release' | 'cover' | 'attachment'>)
    {
        await database.query(
            'UPDATE books SET progress = $2 WHERE id = $1', 
            [id, progress]
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
