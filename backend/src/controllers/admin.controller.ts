import { Prisma } from '@prisma/client';
import { Response } from 'express';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [totalSalesData, activeOrdersCount, totalUsersCount, totalProductsCount, recentOrders] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      }),
      prisma.order.count({
        where: {
          NOT: {
            status: 'DELIVERED'
          }
        }
      }),
      prisma.user.count({
        where: { role: 'CUSTOMER' }
      }),
      prisma.product.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true } }
        }
      })
    ]);

    res.status(200).json({
      totalSales: totalSalesData._sum.totalAmount || 0,
      activeOrders: activeOrdersCount,
      totalUsers: totalUsersCount,
      totalProducts: totalProductsCount,
      recentOrders: recentOrders.map((o: any) => ({
        id: o.id,
        customer: o.user?.name || 'Unknown',
        createdAt: o.createdAt,
        status: o.status,
        total: o.totalAmount
      }))
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
