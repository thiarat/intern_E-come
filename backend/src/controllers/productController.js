const prisma = require('../prisma');

exports.getProducts = async (req, res) => {
  try {
    const { categoryId, search } = req.query;
    
    let where = {};
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price: Number(price), stock: Number(stock), imageUrl, categoryId }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { name, description, price: Number(price), stock: Number(stock), imageUrl, categoryId }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
