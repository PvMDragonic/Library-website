import { IBook } from "../models/Book";
import { Book } from "../models/Book";

export class BookController 
{
    static showAll()
    {
        return Book.showAll();
    }

    static searchByAuthor(author: string)
    {
        console.log(`searching ${author}`)
        return Book.searchByAuthor(author);
    }

    static searchByTitle(title: string)
    {
        return Book.searchByTitle(title);
    }

    static searchById(id: number)
    {
        return Book.searchById(id);
    }

    static async create({title, publisher, release, cover, attachment }: Omit<IBook, 'id' | 'progress'>)
    {
        await Book.create({ title, publisher, release, cover, attachment });
        return await Book.searchByTitle(title);
    }

    static async edit({ id, title, publisher, release, cover, attachment }: Omit<IBook, 'progress'>)
    {
        await Book.edit({ id, title, publisher, release, cover, attachment });
        return await Book.searchById(id);
    }

    static async updateProgress({ id, progress }: Omit<IBook, 'title' | 'publisher' | 'release' | 'cover' | 'attachment'>)
    {
        await Book.updateProgress({ id, progress });
    }

    static delete(id: number)
    {
        return Book.delete(id);
    }
}