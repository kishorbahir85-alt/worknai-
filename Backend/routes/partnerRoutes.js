import express from 'express';
import {
  getPartners,
  getManagePartners,
  createPartner,
  updatePartner,
  deletePartner,
} from '../controllers/partnerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPartners);
router.get('/manage', protect, authorize('admin', 'manager'), getManagePartners);

router.post('/', protect, authorize('admin', 'manager'), createPartner);
router.put('/:id', protect, authorize('admin', 'manager'), updatePartner);
router.delete('/:id', protect, authorize('admin', 'manager'), deletePartner);

export default router;
