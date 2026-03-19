const express = require('express');
const router = express.Router();
const { upload } = require('../helpers/cloudinary');
const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getUsers);

// Get user profile
router.get('/:id', userController.getUserById);

// Register new user (with optional avatar upload via Cloudinary)
router.post('/register', upload.single('photo'), userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Update user profile (with optional avatar upload via Cloudinary)
router.put('/:id', upload.single('photo'), userController.updateUser);

module.exports = router;
