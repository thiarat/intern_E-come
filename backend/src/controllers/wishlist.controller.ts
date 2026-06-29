import { Response } from 'express';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const getWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    if (!req.user || (req.user.userId !== userId && req.user.role !== 'SUPER_ADMIN')) {
      res.status(403).json({ error: 'Forbidden: Access denied' });
      return;
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId, productId } = req.body;

    if (!req.user || (req.user.userId !== userId && req.user.role !== 'SUPER_ADMIN')) {
      res.status(403).json({ error: 'Forbidden: Access denied' });
      return;
    }
    
    // Check if it already exists
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existing) {
      // Remove from wishlist
      await prisma.wishlist.delete({
        where: { id: existing.id }
      });
      res.status(200).json({ message: 'Removed from wishlist', action: 'removed' });
    } else {
      // Add to wishlist
      const added = await prisma.wishlist.create({
        data: { userId, productId },
        include: { product: true }
      });
      res.status(201).json({ message: 'Added to wishlist', action: 'added', item: added });
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
