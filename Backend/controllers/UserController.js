import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createHash, isValidPassword, createToken } from '../services/utils.js';

class UserManager {
    async createUser(data) {
        const { name, email, password } = data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = createHash(password);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        return newUser;
    }

    async authenticateUser(email, password) {
        const user = await User.findOne({ email });
        if (!user || !isValidPassword(user, password)) {
            throw new Error('Invalid email or password');
        }

        const token = createToken(user);
        return { user, token };
    }
}


export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default new UserManager();
