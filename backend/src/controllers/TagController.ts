import { ITag } from "../models/Tags";
import { Tag } from "../models/Tags";
import { BookTags } from "../models/BookTags";

export class TagController 
{
    static showAll()
    {
        return Tag.showAll();
    }

    static searchByBook(bookId: number)
    {
        return BookTags.searchByBook(bookId);
    }

    static searchByLabel(title: string)
    {
        return Tag.searchByLabel(title);
    }

    static async addToBook(bookId: number, tagId: number)
    {
        return BookTags.create(bookId, tagId);
    }

    static async removeBookTagsByBook(bookId: number)
    {
        return BookTags.delete(bookId);
    }

    static async create({ label, color }: Omit<ITag, 'id'>)
    {
        Tag.create({ label, color });
        return Tag.searchByLabel(label);
    }

    static async edit({ id, label, color }: ITag)
    {
        Tag.edit({ id, label, color });
    }

    static delete(id: number)
    {
        return Tag.delete(id);
    }
}