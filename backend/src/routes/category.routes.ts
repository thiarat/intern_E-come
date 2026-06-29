import { Router } from 'express';
import { getAllCategories, createCategory, deleteCategory } from '../controllers/category.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllCategories);
router.post('/', authMiddleware, adminMiddleware, createCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

export default router;
