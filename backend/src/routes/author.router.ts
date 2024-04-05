import { Router } from 'express';
import { AuthorController } from '../controllers/AuthorController';

export const authorRoutes = Router();

authorRoutes.get('/', async (_, res) => 
{
    const authors = await AuthorController.showAll();
    return res.status(200).json(authors);
});

authorRoutes.get('/id/:id', async (req, res) => 
{
    const id = parseInt(req.params.id);
    const authors = await AuthorController.searchByBook(id);
    return res.status(200).json(authors);
});

authorRoutes.post('/new/:name', async (req, res) =>
{
    const authorName = req.params.name;
    const newAuthor = await AuthorController.create(authorName);
    return res.send({ author: newAuthor });
});

authorRoutes.post('/add', async (req, res) => 
{
    const { bookId, authorId } = req.body;
    await AuthorController.addToBook(bookId, authorId);

    return res.send({
        message: 'Author has been successfully added to book.'
    });
});

authorRoutes.put('/:id', async(req, res) => 
{
    const id = parseInt(req.params.id);
    const { label } = req.body;
    const books = await AuthorController.edit(id, label);

    return res.status(200).json(books);
});

authorRoutes.delete('/:id', async(req, res) => 
{
    const id = parseInt(req.params.id);
    await AuthorController.removeRelationByBook(id);
    await AuthorController.delete(id);

    return res.status(200).json({ 
        message: `Author ${id} has been successfully deleted.`
    });
});