import { Router } from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', authMiddleware, adminMiddleware, validateRequest(createProductSchema), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, validateRequest(updateProductSchema), updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
