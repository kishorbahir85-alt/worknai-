import express from 'express';
import {
  getMarketProducts,
  getMarketProductBySlug,
  getMarketFacets,
  getMarketUpdates,
  getAdminMarketProducts,
  createMarketProduct,
  updateMarketProduct,
  deleteMarketProduct,
  scrapeProductUrl,
  autoImportProductFromUrl,
  getMarketPageConfig,
  saveMarketPageConfig,
} from '../controllers/marketController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public discovery endpoints
router.get('/', getMarketProducts);
router.get('/meta/facets', getMarketFacets);
router.get('/updates', getMarketUpdates);
router.get('/page-config', getMarketPageConfig);

// Admin endpoints
router.get('/admin/all', protect, authorize('admin', 'manager'), getAdminMarketProducts);
router.post('/scrape-url', protect, authorize('admin', 'manager'), scrapeProductUrl);
router.post('/auto-import', protect, authorize('admin', 'manager'), autoImportProductFromUrl);
router.post('/page-config', protect, authorize('admin', 'manager'), saveMarketPageConfig);
router.post('/', protect, authorize('admin', 'manager'), createMarketProduct);
router.put('/:id', protect, authorize('admin', 'manager'), updateMarketProduct);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteMarketProduct);

// Single product (by slug)
router.get('/:slug', getMarketProductBySlug);

export default router;

