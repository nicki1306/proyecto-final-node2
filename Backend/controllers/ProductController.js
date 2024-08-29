import Product from '../models/ProductModel.js';
import MongoSingleton from '../services/Mongosingleton.js';

// Obtener todos los productos
export const getProducts = async () => {
    try {
        await MongoSingleton.getInstance();
        const products = await Product.find();
        if (!products || products.length === 0) {
            throw new Error('No se encontraron productos');
        }
        return products; 
    } catch (error) {
        throw new Error('Error al obtener los productos'); 
    }
};

// Obtener un producto por ID
export const getProductById = async (productId) => {
    try {
        await MongoSingleton.getInstance();
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('No se encontró el producto'); 
        }
        return product; 
    } catch (error) {
        throw new Error('Error al obtener el producto'); 
    }
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
    try {
        const product = new Product(productData);
        const savedProduct = await product.save();
        return savedProduct;
    } catch (error) {
        throw new Error('Error al crear el producto'); 
    }
};
