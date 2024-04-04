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

    static async create({title, author, publisher, pages, cover, attachment }: Omit<IBook, 'id'>)
    {
        await Book.create({ title, author, publisher, pages, cover, attachment });
        return await Book.searchByTitle(title);
    }

    static async edit({ id, title, author, publisher, pages, cover, attachment }: IBook)
    {
        await Book.edit({ id, title, author, publisher, pages, cover, attachment });
        return await Book.searchById(id);
    }

    static delete(id: number)
    {
        return Book.delete(id);
    }
}