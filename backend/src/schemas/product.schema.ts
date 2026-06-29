import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    price: z.number().positive('Price must be greater than 0'),
    stock: z.number().int().nonnegative('Stock cannot be negative'),
    description: z.string().optional().nullable(),
    htmlDescription: z.string().optional().nullable(),
    images: z.array(z.string()).optional(),
    categoryId: z.string().uuid('Invalid Category ID').optional().nullable(),
  })
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required').optional(),
    price: z.number().positive('Price must be greater than 0').optional(),
    stock: z.number().int().nonnegative('Stock cannot be negative').optional(),
    description: z.string().optional().nullable(),
    htmlDescription: z.string().optional().nullable(),
    images: z.array(z.string()).optional(),
    categoryId: z.string().uuid('Invalid Category ID').optional().nullable(),
  })
});
