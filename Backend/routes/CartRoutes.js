
import express from 'express';
import { getCart, addToCart, removeFromCart, updateCart, checkout, syncCart } from '../controllers/CartController.js';
import { verifyToken } from '../services/utils.js';

const router = express.Router();

router.use(verifyToken)

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/update', updateCart);
router.post('/checkout', checkout);
router.post('/sync', syncCart);

export default router;
