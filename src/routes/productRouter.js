import express from 'express';
import productController from '../controllers/product.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', productController.getProducts);
router.post('/', productController.addProduct);
router.put('/:id', productController.updateProduct); 
router.delete('/:id', productController.deleteProduct);
router.get('/:id', productController.getProductById);

export default router;
