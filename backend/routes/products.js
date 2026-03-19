const express = require('express');
const router = express.Router();
const { upload } = require('../helpers/cloudinary');
const productController = require('../controllers/productController');

router.get(`/`, productController.getProducts);

router.get(`/:id`, productController.getProductById);

router.post(`/`, upload.single('image'), productController.createProduct);

router.put('/:id', upload.single('image'), productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

router.post('/promo/:id', productController.sendPromo);

module.exports = router;
