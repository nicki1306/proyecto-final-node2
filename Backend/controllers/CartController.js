import Cart from '../models/CartModel.js';
import Product from '../models/ProductModel.js';

// Obtener el carrito del usuario
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
};

// Agregar producto al carrito
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            cart = new Cart({ userId: req.user._id, products: [] });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex >= 0) {
            cart.products[productIndex].quantity += quantity;
        } else {
            const productExists = await Product.findById(productId);
            if (!productExists) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar el producto al carrito', error });
    }
};

// Eliminar producto del carrito
export const removeFromCart = async (req, res) => {
    const { productId } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ message: 'Error al eliminar el producto del carrito', error });
    }
};

// Actualizar la cantidad del producto en el carrito
export const updateCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex >= 0) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ message: 'Error al actualizar la cantidad del producto en el carrito', error });
    }
};

export const checkout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
}