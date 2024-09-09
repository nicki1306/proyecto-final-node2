import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.pluralize(null);

const collection = 'businesses';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    price: { type: Number, required: true }, 
    quantity: { type: Number, default: 1 } 
}, { _id: false });  

const businessSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'El nombre del negocio es obligatorio'],  
        trim: true 
    },
    products: {
        type: [productSchema],  
        validate: [products => products.length > 0, 'Debe haber al menos un producto']  
    }
}, { timestamps: true });  

businessSchema.plugin(mongoosePaginate);

const BusinessModel = mongoose.model(collection, businessSchema);

export default BusinessModel;
