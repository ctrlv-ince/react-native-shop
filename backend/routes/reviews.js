const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Get reviews for a specific product
router.get('/:productId', reviewController.getReviewsByProduct);

// User leaves a review
router.post('/', reviewController.createReview);

// User updates their own review
router.put('/:id', reviewController.updateReview);

module.exports = router;
