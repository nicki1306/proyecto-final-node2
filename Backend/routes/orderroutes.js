import express from 'express';
import { createOrder } from '../controllers/OrderController.js';

const router = express.Router();

// Ruta para crear una nueva orden
router.post('/', createOrder);

export default router;
