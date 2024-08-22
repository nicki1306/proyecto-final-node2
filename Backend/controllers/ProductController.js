import Product from '../models/ProductModel.js';


export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.log('error al obtrener los productos', error);
        res.status(500).json({ message: error.message });
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
