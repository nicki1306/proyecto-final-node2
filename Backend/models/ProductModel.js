import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    toy_name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    age_group: { type: String, required: true },
    price: { type: Number, required: true },
    material: { type: String, required: true },
    color: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    onSale: { type: Boolean, default: false },
    salePrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
