import { database } from "../database/database";

export interface IAuthor
{
    id: number;
    label: string;
}

export class Authors
{
    static async showAll()
    {
        const query = await database.query('SELECT * FROM authors ORDER BY id');
        return query.rows;
    }

    static async searchByLabel(label: string)
    {
        const query = await database.query(
            'SELECT * FROM authors WHERE label = $1', 
            [label]
        );
        return query.rows;
    }

    static async create(label: string)
    {
        const result = await database.query(
            'INSERT INTO authors (label) VALUES ($1) RETURNING *',
            [label]
        );
        return result.rows;
    }

    static async edit(id: number, label: string)
    {
        await database.query(
            'UPDATE authors SET label = $1 WHERE id = $2', 
            [label, id]
        );
    }

    static async delete(id: number)
    {
        await database.query(
            'DELETE FROM authors WHERE id = $1', 
            [id]
        );
    }
}