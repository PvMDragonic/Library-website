import { database } from "../database/database";

export interface IBookTags
{
    id: number;
    book_id: number;
    tag_id: number
}

export class BookTags
{
    static async searchByBook(book_id: number)
    {
        const query = await database.query(
            `SELECT 
                t.id, t.label, t.color
            FROM 
                tags AS t
            JOIN 
                book_tags AS bt ON t.id = bt.id_tag WHERE bt.id_book = $1`, 
            [book_id]
        );
        return query.rows;
    }

    static async create(book_id: number, tag_id: number) 
    {
        await database.query(
            'INSERT INTO book_tags (id_book, id_tag) VALUES ($1, $2)',
            [book_id, tag_id]
        );
    }

    static async delete(book_id: number) 
    {
        await database.query(
            'DELETE FROM book_tags WHERE id_book = $1',
            [book_id]
        );
    }
}