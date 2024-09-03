import path from 'path';
import multer from 'multer';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import config from './config.js';

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
})

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => ({
        folder: 'uploads',
        allowed_formats: ['jpg', 'png'],
        transformation: [{ width: 640 }],
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
    })
});

// Configura almacenamiento local
const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const subFolder = 'uploads';
        cb(null, `${config.UPLOAD_DIR}/${subFolder}/`);
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const uploader = multer({ storage: config.STORAGE === 'cloud' ? cloudStorage : localStorage });