import express from 'express';
import { createInquiry, getAllInquiries, updateInquiryStatus } from '../controllers/inquiryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createInquiry);
router.get('/', protect, authorize('admin', 'manager'), getAllInquiries);
router.put('/:id', protect, authorize('admin', 'manager'), updateInquiryStatus);

export default router;
