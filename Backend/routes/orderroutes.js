import express from 'express';
import { createOrder, getOrdersByUser } from '../controllers/OrderController.js';
import { verifyToken, handlePolicies } from '../services/utils.js';

const router = express.Router();

// Ruta para crear una nueva orden
router.post('/', verifyToken, createOrder);

router.get('/user-orders', verifyToken, getOrdersByUser);

export default router;
