import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/UserModel.js'; 

// Configuración de la estrategia local
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            const isMatch = await user.comparePassword(password); // Asegúrate de tener un método para comparar contraseñas
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Serializar el usuario para la sesión
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializar el usuario de la sesión
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;
