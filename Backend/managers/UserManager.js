import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../services/utils.js';

class UserManager {
    // Registrar usuario
    async registerUser(data) {
        const { name, email, password, role } = data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Encriptar la contraseña
        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await newUser.save();
        return newUser;
    }

    // Autenticar usuario
    async authenticateUser(email, password) {
        const user = await User.findOne({ email });
        console.log('user', user);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = generateToken({ id: user._id, role: user.role });
        return { user, token };
    }
}

export default new UserManager();
