import { Router } from 'express';
import { getReviewsByProduct, addReview } from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/product/:productId', getReviewsByProduct);
router.post('/', authMiddleware, addReview);

export default router;
