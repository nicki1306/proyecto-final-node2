
import express from 'express';
import { getCart, addToCart, removeFromCart, updateCart } from '../controllers/CartController.js';
import { isValidPassword } from '../services/utils.js';

const router = express.Router();

router.get('/',isValidPassword , getCart);
router.post('/add', isValidPassword, addToCart);
router.post('/remove', isValidPassword, removeFromCart);
router.post('/update', isValidPassword, updateCart);

export default router;
