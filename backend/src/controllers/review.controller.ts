import { Response } from 'express';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const getReviewsByProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const productId = req.params.productId as string;
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId, rating, comment } = req.body;
    
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userId = req.user.userId;
    
    // Verify user has actually bought and received the product before allowing review
    const hasBought = await prisma.order.findFirst({
      where: {
        userId,
        status: 'DELIVERED',
        items: {
          some: {
            productId
          }
        }
      }
    });

    if (!hasBought) {
      res.status(403).json({ error: 'You can only review products you have purchased and received.' });
      return;
    }
    
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment
      },
      include: {
        user: { select: { name: true } }
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
