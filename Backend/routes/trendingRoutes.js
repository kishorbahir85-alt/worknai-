import express from 'express';
import {
  getTrending,
  getTrendingBySlug,
  createTrending,
  updateTrending,
  deleteTrending,
} from '../controllers/trendingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTrending);
router.get('/:slug', getTrendingBySlug);

router.post('/', protect, authorize('admin', 'manager'), createTrending);
router.put('/:id', protect, authorize('admin', 'manager'), updateTrending);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteTrending);

export default router;
