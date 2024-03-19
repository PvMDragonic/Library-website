import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { TagController } from '../controllers/TagController';

export const bookRoutes = Router();

bookRoutes.get('/', async (_, res) => {
    const books = await BookController.showAll();
    return res.status(200).json(books);
});

bookRoutes.get('/id/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const book = await BookController.searchById(id);
    return res.status(200).json(book);
});

bookRoutes.get('/name/:name', async (req, res) => {
    const bookName = req.params.name;
    const book = await BookController.searchByTitle(bookName);
    return res.status(200).json(book);
});

bookRoutes.post('/', async (req, res) => {
    const { title, author, publisher, release, cover, attachment } = req.body;
    const newBook = await BookController.create({ 
        title, author, publisher, release, cover, attachment 
    });
    return res.send({
        message: newBook
    });
});

bookRoutes.put('/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    const { title, author, publisher, release, cover, attachment } = req.body;
    const books = await BookController.edit({
        id, title, author, publisher, release, cover, attachment 
    });
    return res.status(200).json(books);
});

bookRoutes.delete('/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    await TagController.removeBookTagsByBook(id);
    await BookController.delete(id);
    return res.status(200).json({ 
        message: `Book ${id} has been successfully deleted.`
    });
});