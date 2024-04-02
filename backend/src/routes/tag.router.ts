import { Router } from 'express';
import { TagController } from '../controllers/TagController';

export const tagRoutes = Router();

tagRoutes.get('/', async (_, res) => 
{
    const tags = await TagController.showAll();
    return res.status(200).json(tags);
});

tagRoutes.get('/:id', async (req, res) => 
{
    const id = parseInt(req.params.id);
    const tagsOnBook = await TagController.searchByBook(id);
    return res.status(200).json(tagsOnBook);
});

tagRoutes.post('/new', async (req, res) => 
{
    const { label, color } = req.body;
    const newTag = await TagController.create({ label, color });
    return res.send({ tag: newTag });
});

tagRoutes.put('/:id', async(req, res) =>
{
    const id = parseInt(req.params.id);
    const { label, color } = req.body;
    const books = await TagController.edit({
        id, label, color 
    });

    return res.status(200).json(books);
});

tagRoutes.delete('/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    await TagController.removeBookTagsByTag(id);
    await TagController.delete(id);

    return res.status(200).json({ 
        message: `Tag ${id} has been successfully deleted.`
    });
});