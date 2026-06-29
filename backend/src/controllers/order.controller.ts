import { Response } from 'express';
import prisma from '../prisma';
import { PaymentService } from '../services/payment.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import axios from 'axios';

// Haversine distance formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Geocoding helper
const geocodeAddress = async (province: string, district: string, subDistrict: string, detail: string) => {
  try {
    const query = `${detail} ${subDistrict} ${district} ${province} Thailand`;
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'NexusDeliveryApp/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lon)
      };
    }
  } catch (error) {
    console.error('Geocoding failed:', error);
  }
  // Siam Paragon coordinates as default
  return { lat: 13.7468, lng: 100.5348 };
};

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId, addressId, address, items, paymentMethod } = req.body;

    if (!req.user || (req.user.userId !== userId && req.user.role !== 'SUPER_ADMIN')) {
      res.status(403).json({ error: 'Forbidden: Cannot create order for another user' });
      return;
    }

    let finalAddressId = addressId;
    let lat = 13.7468;
    let lng = 100.5348;

    if (!finalAddressId && address) {
      // Geocode the new address
      const coords = await geocodeAddress(address.province, address.district, address.subDistrict, address.detail);
      lat = coords.lat;
      lng = coords.lng;

      // Create new address inline
      const newAddress = await prisma.address.create({
        data: {
          userId,
          province: address.province,
          district: address.district,
          subDistrict: address.subDistrict,
          zipCode: address.zipCode,
          detail: address.detail,
          lat,
          lng
        }
      });
      finalAddressId = newAddress.id;
    } else if (finalAddressId) {
      const savedAddr = await prisma.address.findUnique({ where: { id: finalAddressId } });
      if (savedAddr) {
        lat = savedAddr.lat || 13.7468;
        lng = savedAddr.lng || 100.5348;
      }
    }

    if (!finalAddressId) {
      res.status(400).json({ error: 'Address is required' });
      return;
    }

    // items is an array of { productId, quantity }

    // 1. Calculate total amount
    let totalAmount = 0;
    const orderItemsData = [];
    
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        res.status(400).json({ error: `Product ${item.productId} not found` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ error: `Not enough stock for ${product.name}` });
        return;
      }
      
      const priceAtPurchase = product.price;
      totalAmount += priceAtPurchase * item.quantity;
      
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase
      });
    }

    // 2. Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        addressId: finalAddressId,
        totalAmount,
        status: 'PENDING',
        items: {
          create: orderItemsData
        },
        payment: {
          create: {
            method: paymentMethod,
            status: 'PENDING',
            slipUrl: req.body.slipUrl || null
          }
        },
        shipment: {
          create: {
            status: 'PREPARING',
            distance: calculateDistance(13.7468, 100.5348, lat, lng),
            estimatedTime: Math.round((calculateDistance(13.7468, 100.5348, lat, lng) / 30) * 60) + 10
          }
        }
      },
      include: {
        payment: true,
        items: true
      }
    });

    // 3. Deduct stock
    for (const item of orderItemsData) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    // 4. If TRANSFER, generate QR code
    let qrCode = null;
    if (paymentMethod === 'TRANSFER') {
      qrCode = await PaymentService.generateQR(totalAmount);
    }

    res.status(201).json({ message: 'Order created successfully', order, qrCode });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        address: true,
        items: { include: { product: true } },
        payment: true,
        shipment: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED

    const order = await prisma.order.update({
      where: { id: id as string },
      data: { status }
    });

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    if (!req.user || (req.user.userId !== userId && req.user.role !== 'SUPER_ADMIN')) {
      res.status(403).json({ error: 'Forbidden: Cannot access orders of another user' });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        address: true,
        items: { include: { product: true } },
        payment: true,
        shipment: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
