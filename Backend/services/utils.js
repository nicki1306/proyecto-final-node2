import jwt from 'jsonwebtoken';
import config from '../config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const generateToken = (user) => {

    const token = jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email
    }, config.SECRET, {
        
        expiresIn: '24h'

    });
    return token;
    }

    











export default __dirname;

