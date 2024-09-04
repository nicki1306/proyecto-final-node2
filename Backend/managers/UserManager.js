// managers/UserManager.js
import User from '../models/UserModel.js';
import { createHash, isValidPassword, createToken } from '../services/utils.js';

class UserManager {
    async registerUser(data) {
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
        console.log('user', user)
        if (!user || !isValidPassword(password, user.password)) {
            throw new Error('Invalid email or password', user);
        }

        const token = createToken({ id: user._id });
        return { user, token };
}
}

export default new UserManager();
