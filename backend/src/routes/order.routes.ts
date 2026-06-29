import { Router } from 'express';
import { createOrder, getAllOrders, updateOrderStatus, getUserOrders } from '../controllers/order.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.get('/user/:userId', authMiddleware, getUserOrders);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
