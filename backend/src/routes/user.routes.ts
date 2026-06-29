import { Router } from 'express';
import { getAllUsers, updateUserRole, deleteUser, getUserProfile, updateUserProfile } from '../controllers/user.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserProfile);
router.put('/:id', authMiddleware, updateUserProfile);
router.put('/:id/role', authMiddleware, adminMiddleware, updateUserRole);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;
