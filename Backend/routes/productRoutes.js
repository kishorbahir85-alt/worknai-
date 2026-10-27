import express from 'express';
import { getProducts, getManageProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadProductImages } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/manage', protect, authorize('admin', 'manager', 'hr'), getManageProducts);
router.post('/', protect, authorize('admin', 'manager', 'hr'), uploadProductImages, createProduct);
router.put('/:id', protect, authorize('admin', 'manager', 'hr'), uploadProductImages, updateProduct);
router.delete('/:id', protect, authorize('admin', 'manager', 'hr'), deleteProduct);
router.get('/:slug', getProductBySlug);

export default router;
