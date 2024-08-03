import express from 'express';
import multer from 'multer';
import path from 'path';
import Post from '../mongodb/models/post.js';

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// GET ALL POSTS
router.route('/').get(async (req, res) => {
    try {
        const posts = await Post.find({});
        const postsWithFullImageUrl = posts.map(post => ({
            ...post._doc,
            photo: `http://localhost:8080/uploads/${post.photo}`
        }));
        res.status(200).json({ success: true, data: postsWithFullImageUrl });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// CREATE A POST
router.route('/').post(upload.single('photo'), async (req, res) => {
    try {
        const { name, caption } = req.body;
        const photo = req.file.filename;

        const newPost = await Post.create({
            name,
            caption,
            photo,
        });

        res.status(201).json({ 
            success: true, 
            data: {
                ...newPost._doc,
                photo: `http://localhost:8080/uploads/${photo}`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;