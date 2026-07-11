import express from 'express';
import { create Enquiry, getAllInquiries, update EnquiryStatus } from '../controllers/ EnquiryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', create Enquiry);
router.get('/', protect, authorize('admin', 'manager'), getAllInquiries);
router.put('/:id', protect, authorize('admin', 'manager'), update EnquiryStatus);

export default router;
