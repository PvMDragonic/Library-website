import { Authors } from "../models/Authors";
import { BookAuthors } from "../models/BookAuthors";

export class AuthorController
{
    static async showAll()
    {
        return Authors.showAll();
    }

    static async searchByBook(bookId: number)
    {
        return BookAuthors.searchByBook(bookId);
    }

    static async searchByLabel(title: string)
    {
        return Authors.searchByLabel(title);
    }

    static async addToBook(bookId: number, authorId: number)
    {
        return BookAuthors.create(bookId, authorId);
    }

    static async removeRelationByBook(bookId: number)
    {
        return BookAuthors.deleteByBook(bookId);
    }

    static async create(label: string)
    {
        return await Authors.create(label);
    }
    
    static async edit(id: number, label: string)
    {
        Authors.edit(id, label);
    }

    static delete(id: number)
    {
        return Authors.delete(id);
    }
}