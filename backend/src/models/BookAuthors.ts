import { database } from "../database/database";

export class BookAuthors
{
    static async searchByBook(id_book: number)
    {
        const query = await database.query(
            `SELECT 
                a.id, a.label
            FROM 
                authors AS a
            JOIN 
                book_authors AS ba ON a.id = ba.id_author WHERE ba.id_book = $1`, 
            [id_book]
        );
        return query.rows;
    }

    static async create(id_book: number, id_author: number) 
    {
        await database.query(
            'INSERT INTO book_authors (id_book, id_author) VALUES ($1, $2)',
            [id_book, id_author]
        );
    }

    static async deleteByBook(id_book: number) 
    {
        await database.query(
            'DELETE FROM book_authors WHERE id_book = $1',
            [id_book]
        );
    }
}