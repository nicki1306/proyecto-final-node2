
import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, default: 1, min: 1 },
        },
    ],
}, {timestamps: true}); 

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
