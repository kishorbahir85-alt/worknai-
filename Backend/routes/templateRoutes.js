import express from 'express';
import {
  getTemplates,
  getTemplateBySlug,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../controllers/templateController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTemplates);
router.get('/:slug', getTemplateBySlug);

router.post('/', protect, authorize('admin', 'manager'), createTemplate);
router.put('/:id', protect, authorize('admin', 'manager'), updateTemplate);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteTemplate);

export default router;
