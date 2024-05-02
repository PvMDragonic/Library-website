import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { TagController } from '../controllers/TagController';
import { IBook } from '../models/Book';
import { ITag } from '../models/Tags';

interface IBookComplete extends IBook
{
    tags: ITag[];
}

export const bookRoutes = Router();

async function saveTags(tags: ITag[], bookId: number)
{
    for (const tag of tags)
    {
        const tagLabel = tag.label;
        let registeredTag = (await TagController.searchByLabel(tagLabel))[0] as ITag;

        if (!registeredTag)
            registeredTag = (await TagController.create(tag))[0] as ITag;
    
        await TagController.addToBook(bookId, registeredTag.id);
    }
}

bookRoutes.get('/', async (_, res) => {
    const books = (await BookController.showAll()) as IBookComplete[];
    for (const book of books) 
        book.tags = await TagController.searchByBook(book.id);

    return res.status(200).json(books);
});

bookRoutes.get('/id/:id', async (req, res) => 
{
    const id = parseInt(req.params.id);
    const book = (await BookController.searchById(id))[0] as IBookComplete;
    book.tags = await TagController.searchByBook(id);

    return res.status(200).json([book]);
});

bookRoutes.post('/', async (req, res) => 
{
    const { title, author, publisher, tags, release, cover, attachment } = req.body;
    const bookInfo = { title, author, publisher, release, cover, attachment };
    const newBook = (await BookController.create(bookInfo))[0] as IBookComplete;

    await saveTags(tags, newBook.id);

    return res.status(200).json({
        message: 'Book created successfully.'
    });
});

bookRoutes.put('/', async(req, res) => 
{
    const { id, title, author, publisher, tags, release, cover, attachment } = req.body;
    await BookController.edit({ id, title, author, publisher, release, cover, attachment });

    // Easier to wipe and start fresh.
    await TagController.removeBookTagsByBook(id);
    await saveTags(tags, id);

    return res.status(200).json({
        message: 'Book edited successfully.'
    });;
});

bookRoutes.delete('/:id', async(req, res) => 
{
    const id = parseInt(req.params.id);
    await TagController.removeBookTagsByBook(id);
    await BookController.delete(id);

    return res.status(200).json({ 
        message: `Book ${id} has been successfully deleted.`
    });
});