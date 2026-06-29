const prisma = require('../prisma');

exports.createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body;
    
    // Get cart items
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total
    const totalAmount = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    // Create Order inside a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          addressId,
          totalAmount,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }))
          },
          payment: {
            create: {
              method: paymentMethod
            }
          },
          shipment: {
            create: {
              status: 'PENDING'
            }
          }
        }
      });

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      // Reduce stock (simple implementation, ideally should handle race conditions)
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } }, payment: true, shipment: true, address: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } }, payment: true, shipment: true, address: true }
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin routes
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, payment: true, shipment: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await prisma.payment.update({
      where: { orderId: req.params.id },
      data: { status }
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
