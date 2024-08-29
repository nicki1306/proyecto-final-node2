import Product from '../models/ProductModel.js';
import MongoSingleton from '../services/Mongosingleton.js';

export const getProducts = async (req, res) => {
    try {
        await MongoSingleton.getInstance();
        const products = await Product.find();
        console.log(products);
        if (!products || products.length === 0) {
            throw new Error('No se encontraron productos');
        }
        return products;
    } catch (error) {
        throw new Error('Error al obtener los productos');
    }
};

export const createProduct = async (req, res) => {
    const product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
