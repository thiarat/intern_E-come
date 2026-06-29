const prisma = require('../prisma');

exports.getCart = async (req, res) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } }
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: { items: { include: { product: true } } }
      });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user.id } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity }
      });
    }

    res.json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    await prisma.cartItem.update({
      where: { id: req.params.id },
      data: { quantity }
    });
    res.json({ message: 'Cart item updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    await prisma.cartItem.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Cart item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
