const { Product } = require('../models/product');
const { Category } = require('../models/category');
const { User } = require('../models/user');
const mongoose = require('mongoose');

exports.getProducts = async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }

    const productList = await Product.find(filter).populate('category');

    if (!productList) {
        return res.status(500).json({ success: false });
    }
    res.send(productList);
};

exports.getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        return res.status(500).json({ success: false });
    }
    res.send(product);
};

exports.createProduct = async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');
    
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        images: [{
            public_id: req.file.filename || req.file.public_id || 'default',
            url: req.file.path,
        }],
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
    });

    product = await product.save();

    if (!product) return res.status(500).send('The product cannot be created');

    res.send(product);
};

exports.updateProduct = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid Product!');

    const file = req.file;
    let images = product.images;

    if (file) {
        images = [{
            public_id: req.file.filename || req.file.public_id || 'default',
            url: req.file.path,
        }];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            images: images,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock,
        },
        { new: true }
    );

    if (!updatedProduct) return res.status(500).send('the product cannot be updated!');

    res.send(updatedProduct);
};

exports.deleteProduct = (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then((product) => {
            if (product) {
                return res.status(200).json({ success: true, message: 'the product is deleted!' });
            } else {
                return res.status(404).json({ success: false, message: 'product not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
};

exports.sendPromo = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const users = await User.find({ pushToken: { $exists: true, $ne: '' } });
    
    const { Expo } = await import('expo-server-sdk');
    let expo = new Expo();
    let messages = [];

    for (let user of users) {
        if (!Expo.isExpoPushToken(user.pushToken)) continue;

        messages.push({
            to: user.pushToken,
            sound: 'default',
            title: 'Special Promotion!',
            body: `${product.name} is on sale! Check it out now!`,
            data: { promoId: product._id }
        });
    }

    try {
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }
        res.status(200).json({ success: true, message: 'Promo notifications sent', tickets });
    } catch (error) {
         console.error('Error sending push notifications', error);
         res.status(500).json({ success: false, error: error });
    }
};
