import { Router } from 'express';
import { bookRoutes } from './book.router';
import { tagRoutes } from './tag.router';
import { authorRoutes } from './author.router';

export const router = Router();

router.use('/books', bookRoutes);
router.use('/tags', tagRoutes);
router.use('/authors', authorRoutes);