import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: { type: String, enum: ['admin', 'premium', 'user'], default: 'user' },
    last_login: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
});

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

export default User;
