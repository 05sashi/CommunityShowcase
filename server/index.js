import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import postRoutes from './routes/postRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/post', postRoutes);

app.get('/', async (req, res) => {
    res.send('Hello from the Image Sharing App!');
});

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/imageSharingApp', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to local MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};

const startServer = async () => {
    try {
        await connectDB();
        app.listen(8080, () => console.log('Server has started on port http://localhost:8080'));
    } catch (error) {
        console.log(error);
    }
};

startServer();