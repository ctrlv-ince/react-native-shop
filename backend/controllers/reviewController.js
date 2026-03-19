const { Review } = require('../models/review');
const { Order } = require('../models/order');
const { Product } = require('../models/product');
const mongoose = require('mongoose');

// Get reviews for a specific product
exports.getReviewsByProduct = async (req, res) => {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    if (!reviews) return res.status(500).json({ success: false });
    res.send(reviews);
};

// User leaves a review
exports.createReview = async (req, res) => {
    const { user, product, rating, comment } = req.body;

    // Verify purchased product
    // The user must have an order with status 'Delivered' or 'Shipped' (2 or 3) containing this product
    const orders = await Order.find({ user: user, status: { $in: ['Shipped', 'Delivered'] } }).populate('orderItems');
    if (!orders || orders.length === 0) {
        return res.status(403).send('You must have a verified purchase to leave a review.');
    }

    let hasPurchased = false;
    for (let order of orders) {
        for (let item of order.orderItems) {
            if (item.product.toString() === product) {
                hasPurchased = true;
                break;
            }
        }
        if (hasPurchased) break;
    }

    if (!hasPurchased) {
        return res.status(403).send('You did not purchase this product or it has not been delivered.');
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ user: user, product: product });
    if (existingReview) {
        return res.status(400).send('You have already reviewed this product. You can update it instead.');
    }

    let review = new Review({
        user,
        product,
        rating,
        comment
    });

    review = await review.save();

    // Update Product average rating
    const reviews = await Review.find({ product });
    const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(product, { rating: avgRating, numReviews: reviews.length });

    res.send(review);
};

// User updates their own review
exports.updateReview = async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).send('Review not found');

    // Verify ownership
    if (review.user.toString() !== req.body.user) {
        return res.status(403).send('You can only update your own review');
    }

    review.rating = req.body.rating;
    review.comment = req.body.comment;
    await review.save();

    if (!review) return res.status(400).send('the review cannot be updated!');

    // Update Product average rating
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(review.product, { rating: avgRating });

    res.send(review);
};
