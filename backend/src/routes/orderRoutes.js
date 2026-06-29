const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, getAllOrders, updateOrderStatus, updatePaymentStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, getOrders);

router.route('/admin')
  .get(protect, admin, getAllOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

router.route('/:id/payment')
  .put(protect, admin, updatePaymentStatus);

module.exports = router;
