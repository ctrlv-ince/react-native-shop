const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res) => {
    try {
        const userList = await User.find().select('-passwordHash');

        if (!userList) {
            return res.status(500).json({ success: false });
        }
        res.send(userList);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');

        if (!user) {
            return res.status(500).json({ message: 'The user with the given ID was not found.' });
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.registerUser = async (req, res) => {
    try {
        // If a photo was uploaded via multer/cloudinary, use the URL
        let photoUrl = '';
        if (req.file) {
            photoUrl = req.file.path; // Cloudinary returns the URL in path
        }

        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            address: req.body.address || '',
            pushToken: req.body.pushToken || '',
            photo: photoUrl,
        });
        user = await user.save();

        if (!user) return res.status(400).send('the user cannot be created!');

        res.send(user);
    } catch (err) {
        console.error("Registration validation error:", err);
        return res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        const secret = process.env.SECRET;

        if (!user) {
            return res.status(400).json({ message: 'The user not found' });
        }

        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign(
                {
                    userId: user.id,
                    isAdmin: user.isAdmin
                },
                secret,
                { expiresIn: '1d' }
            );

            res.status(200).send({ user: user.email, token: token, userId: user.id, pushToken: user.pushToken });
        } else {
            res.status(400).json({ message: 'password is wrong' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Server error during login', error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userExist = await User.findById(req.params.id);
        if (!userExist) return res.status(400).send('Invalid user ID');

        let newPassword;
        if (req.body.password) {
            newPassword = bcrypt.hashSync(req.body.password, 10);
        } else {
            newPassword = userExist.passwordHash;
        }

        // If a photo was uploaded via multer/cloudinary, use the URL
        let photopath;
        if (req.file) {
            photopath = req.file.path; // Cloudinary returns the URL in path
        } else {
            photopath = userExist.photo;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name || userExist.name,
                email: req.body.email || userExist.email,
                passwordHash: newPassword,
                phone: req.body.phone || userExist.phone,
                isAdmin: req.body.isAdmin !== undefined ? req.body.isAdmin : userExist.isAdmin,
                address: req.body.address !== undefined ? req.body.address : userExist.address,
                pushToken: req.body.pushToken || userExist.pushToken,
                photo: photopath,
            },
            { new: true }
        );

        if (!user) return res.status(400).send('the user cannot be updated!');

        res.send(user);
    } catch (err) {
        return res.status(500).json({ message: 'Server error during update', error: err.message });
    }
};
