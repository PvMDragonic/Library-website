import { IBook } from "../models/Book";
import { Book } from "../models/Book";

export class BookController 
{
    static showAll()
    {
        return Book.showAll();
    }

    static searchByTitle(title: string)
    {
        return Book.searchByTitle(title);
    }

    static searchById(id: number)
    {
        return Book.searchById(id);
    }

    static async create({title, author, publisher, pages}: Omit<IBook, 'id'>)
    {
        Book.create({ title, author, publisher, pages });
        return Book.searchByTitle(title);
    }

    static async edit({ id, title, author, publisher, pages}: IBook)
    {
        Book.edit({ id, title, author, publisher, pages });
        return Book.searchById(id);
    }

    static delete(id: number)
    {
        return Book.delete(id);
    }
}