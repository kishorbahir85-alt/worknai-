import asyncHandler from 'express-async-handler';
import Blog from '../models/blogModel.js';
import { slugify } from '../utils/slugify.js';
import cloudinary, { ensureCloudinaryConfigured } from '../config/cloudinary.js';

const publicIdFromUrl = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  const afterUpload = url.split('/upload/')[1];
  if (!afterUpload) return null;
  const withoutVersion = afterUpload.replace(/^v\d+\//, '');
  return withoutVersion.replace(/\.[^./]+$/, '');
};

const destroyCloudinaryAsset = (url) => {
  const publicId = publicIdFromUrl(url);
  if (!publicId) return;
  ensureCloudinaryConfigured();
  cloudinary.uploader.destroy(publicId).catch(() => {});
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) return value.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

const toBool = (value) => value === true || value === 'true';

export const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ isActive: true })
    .populate('postedBy', 'name role')
    .sort('-createdAt');
  res.json({ data: blogs });
});

export const getFeaturedBlog = asyncHandler(async (req, res) => {
  const featured = await Blog.findOne({ isActive: true, isFeatured: true })
    .populate('postedBy', 'name role')
    .sort('-updatedAt');
  const fallback = featured || await Blog.findOne({ isActive: true })
    .populate('postedBy', 'name role')
    .sort('-createdAt');
  res.json({ data: fallback || null });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, isActive: true }).populate('postedBy', 'name role');
  if (!blog) { res.status(404); throw new Error('Blog post not found'); }
  res.json({ data: blog });
});

export const getManageBlogs = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { postedBy: req.user._id };
  const blogs = await Blog.find(filter)
    .populate('postedBy', 'name email role')
    .sort('-createdAt');
  res.json({ data: blogs });
});

export const createBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category, tags, isFeatured, coverImageText } = req.body;
  if (!title) { res.status(400); throw new Error('Title is required'); }
  const coverFile = req.files?.coverImage?.[0];
  const blog = await Blog.create({
    title, slug: slugify(title), excerpt, content, category,
    coverImage: coverImageText?.trim() || coverFile?.path || '',
    tags: toArray(tags),
    isFeatured: toBool(isFeatured),
    postedBy: req.user._id,
  });
  res.status(201).json({ data: blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) { res.status(404); throw new Error('Blog post not found'); }
  if (req.user.role !== 'admin' && blog.postedBy.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  const fields = ['title', 'excerpt', 'content', 'category'];
  fields.forEach(f => { if (req.body[f] !== undefined) blog[f] = req.body[f]; });
  if (req.body.tags !== undefined) blog.tags = toArray(req.body.tags);
  if (req.body.isActive !== undefined) blog.isActive = toBool(req.body.isActive);
  if (req.body.isFeatured !== undefined) blog.isFeatured = toBool(req.body.isFeatured);

  const coverFile = req.files?.coverImage?.[0];
  const newCover = req.body.coverImageText?.trim() || coverFile?.path;
  if (newCover) {
    destroyCloudinaryAsset(blog.coverImage);
    blog.coverImage = newCover;
  }

  await blog.save();
  res.json({ data: blog });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) { res.status(404); throw new Error('Blog post not found'); }
  if (req.user.role !== 'admin' && blog.postedBy.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  destroyCloudinaryAsset(blog.coverImage);
  await blog.deleteOne();
  res.json({ message: 'Blog post deleted' });
});
