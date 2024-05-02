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
        const result = await database.query(
            'INSERT INTO tags (label, color) VALUES ($1, $2) RETURNING *',
            [label, color]
        );
        return result.rows;
    }

    static async edit({ id, label, color }: ITag)
    {
        await database.query(
            'UPDATE tags SET label = $1, color = $2 WHERE id = $3', 
            [label, color, id]
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