import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/stats', authMiddleware, adminMiddleware, getDashboardStats);

export default router;
