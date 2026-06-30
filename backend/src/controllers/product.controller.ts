import { Request, Response } from 'express';
import prisma from '../prisma';

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    
    let whereClause: any = {};
    
    if (search) {
      whereClause.name = {
        contains: search,
        mode: 'insensitive' // Requires postgresql for mode insensitive
      };
    }
    
    if (category) {
      whereClause.category = {
        name: {
          equals: category,
          mode: 'insensitive'
        }
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { category: true }
    });
    res.status(200).json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, htmlDescription, price, stock, categoryId, images } = req.body;

    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        htmlDescription,
        price,
        stock,
        categoryId,
        images: images || []
      }
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, description, htmlDescription, price, stock, categoryId, images } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        htmlDescription,
        price,
        stock,
        categoryId,
        images: images || undefined
      }
    });

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    // Delete non-critical dependent records first
    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.wishlist.deleteMany({ where: { productId: id } });
    await prisma.review.deleteMany({ where: { productId: id } });

    await prisma.product.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    if (error.code === 'P2003') {
      res.status(400).json({ error: 'Cannot delete product because it is referenced in past orders.' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
