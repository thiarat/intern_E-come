const prisma = require('../prisma');

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    const category = await prisma.category.create({
      data: { name, imageUrl }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
