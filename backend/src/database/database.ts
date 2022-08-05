import { Pool } from "pg";

export const database = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'library',
    password: '123456'
});