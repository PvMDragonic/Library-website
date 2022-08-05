import { Router } from 'express';
import { bookRoutes } from './book.router';

export const router = Router();

router.use('/books', bookRoutes);