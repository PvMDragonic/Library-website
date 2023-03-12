import { database } from "../database/database";

export interface ITag
{
    id: number;
    label: string;
    color: string;
}

export class Tag
{
    static async showAll()
    {
        const query = await database.query('SELECT * FROM tags ORDER BY id');
        return query.rows;
    }

    static async searchByLabel(label: string)
    {
        const query = await database.query(
            'SELECT * FROM tags WHERE label = $1', 
            [label]
        );
        return query.rows;
    }

    static async searchByBook(bookId: number)
    {
        const query = await database.query(
            'SELECT * FROM book_tags WHERE id_book = $1', 
            [bookId]
        );
        return query.rows;
    }

    static async create({ label, color }: Omit<ITag, 'id'>)
    {
        await database.query(
            'INSERT INTO tags (label, color) VALUES ($1, $2)',
            [label, color]
        );
    }

    static async edit({ id, label }: ITag)
    {
        await database.query(
            'UPDATE tags SET label = $1 WHERE id = $2', 
            [label, id]
        );
    }

    static async delete(id: number)
    {
        await database.query(
            'DELETE FROM tags WHERE id = $1', 
            [id]
        );
    }
}