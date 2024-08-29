
import express from 'express';
import { getCart, addToCart, removeFromCart, updateCart } from '../controllers/CartController.js';
import { isValidPassword } from '../services/utils.js';

const router = express.Router();

router.use(isValidPassword)

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/update', updateCart);

export default router;
