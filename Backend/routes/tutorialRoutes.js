import express from 'express';
import { getTutorials, getManageTutorials, getTutorialBySlug, createTutorial, updateTutorial, deleteTutorial } from '../controllers/tutorialController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadTutorialImages } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getTutorials);
router.get('/manage', protect, authorize('admin', 'manager'), getManageTutorials);
router.post('/', protect, authorize('admin', 'manager'), uploadTutorialImages, createTutorial);
router.put('/:id', protect, authorize('admin', 'manager'), uploadTutorialImages, updateTutorial);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteTutorial);
router.get('/:slug', getTutorialBySlug);

export default router;
