import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import mongoosePaginate from 'mongoose-paginate-v2';
import validator from 'validator'; 

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
        validate: [validator.isEmail, 'Invalid email format'] 
    },
    password: {
        type: String,
        required: true,
        minlength: 6 
    },
    role: { type: String, enum: ['admin', 'premium', 'user'], default: 'user' },
    last_login: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.updateLastLogin = async function () {
    this.last_login = Date.now();
    await this.save();
};

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

export default User;
