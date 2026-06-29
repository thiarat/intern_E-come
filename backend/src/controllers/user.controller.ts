import { Request, Response } from 'express';
import prisma from '../prisma';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body; // SUPER_ADMIN, ADMIN, CUSTOMER

    const updated = await prisma.user.update({
      where: { id: id as string },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    res.status(200).json({ message: 'User role updated successfully', user: updated });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: id as string }
    });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        addresses: true,
        createdAt: true,
      }
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, phone, email } = req.body;
    const updated = await prisma.user.update({
      where: { id },
      data: { name, phone, email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      }
    });
    res.status(200).json({ message: 'Profile updated successfully', user: updated });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
