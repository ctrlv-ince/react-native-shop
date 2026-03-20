const { Product } = require('../models/product');
const { Order } = require('../models/order');
const mongoose = require('mongoose');

// Get reviews for a specific product
exports.getReviewsByProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId)
            .select('reviews')
            .populate('reviews.user', 'name');

        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        res.send(product.reviews);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// User leaves a review
exports.createReview = async (req, res) => {
    try {
        const { user, product: productId, rating, comment, order: orderId } = req.body;

        // Verify purchased product
        const orders = await Order.find({ user: user, status: { $in: ['Shipped', 'Delivered'] } });
        if (!orders || orders.length === 0) {
            return res.status(403).send('You must have a verified purchase to leave a review.');
        }

        let hasPurchased = false;
        for (let order of orders) {
            for (let item of order.orderItems) {
                if (item.product.toString() === productId) {
                    hasPurchased = true;
                    break;
                }
            }
            if (hasPurchased) break;
        }

        if (!hasPurchased) {
            return res.status(403).send('You did not purchase this product or it has not been delivered.');
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).send('Product not found');

        // Check if user already reviewed this product
        const existingReview = product.reviews.find(r => r.user.toString() === user);
        if (existingReview) {
            return res.status(400).send('You have already reviewed this product. You can update it instead.');
        }

        // Add review as embedded subdocument
        product.reviews.push({
            user,
            name: req.body.name || 'User',
            rating,
            comment,
            order: orderId,
        });

        // Update product average rating
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

        await product.save();

        // Mark isReviewed on the order item
        if (orderId) {
            await Order.updateOne(
                { _id: orderId, 'orderItems.product': productId },
                { $set: { 'orderItems.$.isReviewed': true } }
            );
        }

        res.send(product.reviews[product.reviews.length - 1]);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// User updates their own review
exports.updateReview = async (req, res) => {
    try {
        const product = await Product.findOne({ 'reviews._id': req.params.id });
        if (!product) return res.status(404).send('Review not found');

        const review = product.reviews.id(req.params.id);
        if (!review) return res.status(404).send('Review not found');

        // Verify ownership
        if (review.user.toString() !== req.body.user) {
            return res.status(403).send('You can only update your own review');
        }

        review.rating = req.body.rating;
        review.comment = req.body.comment;

        // Recalculate average rating
        product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

        await product.save();

        res.send(review);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
