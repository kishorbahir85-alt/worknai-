import express from 'express';
import { getBlogs, getFeaturedBlog, getManageBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadBlogImages } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/featured/latest', getFeaturedBlog);
router.get('/manage', protect, authorize('admin', 'manager'), getManageBlogs);
router.post('/', protect, authorize('admin', 'manager'), uploadBlogImages, createBlog);
router.put('/:id', protect, authorize('admin', 'manager'), uploadBlogImages, updateBlog);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteBlog);
router.get('/:slug', getBlogBySlug);

export default router;
