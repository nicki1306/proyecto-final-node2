import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../services/utils.js';

class UserManager {
    // Registrar usuario
    async registerUser(data) {
        const { name, email, password, role } = data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('El usuario ya existe');
        }

        const hashedPassword = await bcrypt.hash(password.trim(), bcrypt.genSaltSync(10));

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

        if (!user || !user._id)  {
            throw new Error('Usuario no encontrado o no tiene _id válido');
        }

        const trimmedPassword = password.trim();

        const isMatch = await bcrypt.compare(trimmedPassword, user.password);


        console.log('Contraseña en texto plano:', password);
        console.log('Hash almacenado:', user.password);
        console.log('¿Contraseña coincide?', isMatch);

        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = generateToken({ userId: user._id.toString(), role: user.role });
        return { user, token };
    }
}

export default new UserManager();
