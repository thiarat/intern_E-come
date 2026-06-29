import { Router } from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlist.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:userId', authMiddleware, getWishlist);
router.post('/toggle', authMiddleware, toggleWishlist);

export default router;
