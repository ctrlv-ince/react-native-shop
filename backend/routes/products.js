const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, productController.getProducts);

router.get(`/:id`, productController.getProductById);

router.post(`/`, uploadOptions.single('image'), productController.createProduct);

router.put('/:id', uploadOptions.single('image'), productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

router.post('/promo/:id', productController.sendPromo);

module.exports = router;
