import UserManager from '../managers/UserManager.js';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {

        const { user, token } = await UserManager.authenticateUser(email, password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({ user, token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(401).json({ message: error.message });
    }
};
