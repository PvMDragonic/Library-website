import { Router } from 'express';
import { TagController } from '../controllers/TagController';

export const tagRoutes = Router();

tagRoutes.get('/', async (_, res) => {
    const books = await TagController.showAll();
    return res.status(200).json(books);
});

tagRoutes.get('/id/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const tagsOnBook = await TagController.searchByBook(id);
    return res.status(200).json(tagsOnBook);
});

tagRoutes.get('/name/:name', async (req, res) => {
    const tagName = req.params.name;
    const tag = await TagController.searchByLabel(tagName);
    return res.status(200).json(tag);
});

tagRoutes.post('/new', async (req, res) => {
    const { label, color } = req.body;
    await TagController.create({ 
        label, color 
    });
    return res.send({
        message: 'Tag has been successfully created.'
    });
});

tagRoutes.post('/add', async (req, res) => {
    const { bookId, tagId } = req.body;
    await TagController.addToBook(bookId, tagId);
    return res.send({
        message: 'Tag has been successfully created.'
    });
});

tagRoutes.put('/:id', async(req, res) =>{
    const id = parseInt(req.params.id);
    const { label, color } = req.body;
    const books = await TagController.edit({
        id, label, color 
    });
    return res.status(200).json(books);
});

tagRoutes.delete('/relationship/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    await TagController.removeBookTagsByBook(id);
    return res.status(200).json({ 
        message: `Tags from book ${id} have been successfully removed.`
    });
});

tagRoutes.delete('/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    await TagController.delete(id);
    return res.status(200).json({ 
        message: `Tag ${id} has been successfully deleted.`
    });
});