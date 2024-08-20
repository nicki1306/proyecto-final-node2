import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    toy_name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    age_group: { type: String, required: true },
    price: { type: Number, required: true },
    material: { type: String, required: true },
    color: { type: String, required: true },
    dimensions: { type: String, required: true },
    //stock: { type: Number, required: true },
    //imageUrl: { type: String, required: true },
    
});

const Product = mongoose.model('Product', productSchema);

export default Product;
