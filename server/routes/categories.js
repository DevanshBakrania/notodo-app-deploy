const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, color } = req.body;
    const category = await Category.create({
      user: req.user.id,
      name,
      color
    });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });

    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;