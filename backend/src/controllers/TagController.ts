import { ITag } from "../models/Tags";
import { Tag } from "../models/Tags";
import { BookTags } from "../models/BookTags";

export class TagController 
{
    static async showAll()
    {
        return Tag.showAll();
    }

    static async showAllRelations()
    {
        return Tag.showAllRelations();
    }

    static async searchByBook(bookId: number)
    {
        return BookTags.searchByBook(bookId);
    }

    static async searchByLabel(title: string)
    {
        return Tag.searchByLabel(title);
    }

    static async addToBook(bookId: number, tagId: number)
    {
        return BookTags.create(bookId, tagId);
    }

    static async removeBookTagsByBook(bookId: number)
    {
        return BookTags.deleteByBook(bookId);
    }

    static async removeBookTagsByTag(tagId: number)
    {
        return BookTags.deleteByTag(tagId);
    }

    static async create({ label, color }: Omit<ITag, 'id'>)
    {
        return await Tag.create({ label, color });
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