// controllers/UserController.js
import UserManager from '../managers/UserManager.js';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('hola', res);
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const user = await UserManager.registerUser({ name, email, password });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({ message: error.message });
    }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { user, token } = await UserManager.authenticateUser(email, password);
        console.log(email);
        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
