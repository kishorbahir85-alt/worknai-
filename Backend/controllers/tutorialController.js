import asyncHandler from 'express-async-handler';
import Tutorial from '../models/tutorialModel.js';
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

const toJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const getTutorials = asyncHandler(async (req, res) => {
  const tutorials = await Tutorial.find({ isActive: true })
    .populate('postedBy', 'name role')
    .sort('-createdAt');
  res.json({ data: tutorials });
});

export const getTutorialBySlug = asyncHandler(async (req, res) => {
  const tutorial = await Tutorial.findOne({ slug: req.params.slug, isActive: true }).populate('postedBy', 'name role');
  if (!tutorial) { res.status(404); throw new Error('Tutorial not found'); }
  res.json({ data: tutorial });
});

export const getManageTutorials = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { postedBy: req.user._id };
  const tutorials = await Tutorial.find(filter)
    .populate('postedBy', 'name email role')
    .sort('-createdAt');
  res.json({ data: tutorials });
});

export const createTutorial = asyncHandler(async (req, res) => {
  const { title, description, difficulty, videoUrl, steps, tags, coverImageText } = req.body;
  if (!title) { res.status(400); throw new Error('Title is required'); }
  const coverFile = req.files?.coverImage?.[0];
  const tutorial = await Tutorial.create({
    title, slug: slugify(title), description, difficulty, videoUrl: videoUrl || '',
    coverImage: coverImageText?.trim() || coverFile?.path || '',
    steps: toJsonArray(steps),
    tags: toArray(tags),
    postedBy: req.user._id,
  });
  res.status(201).json({ data: tutorial });
});

export const updateTutorial = asyncHandler(async (req, res) => {
  const tutorial = await Tutorial.findById(req.params.id);
  if (!tutorial) { res.status(404); throw new Error('Tutorial not found'); }
  if (req.user.role !== 'admin' && tutorial.postedBy.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  const fields = ['title', 'description', 'difficulty', 'videoUrl', 'isActive'];
  fields.forEach(f => { if (req.body[f] !== undefined) tutorial[f] = req.body[f]; });
  if (req.body.steps !== undefined) tutorial.steps = toJsonArray(req.body.steps);
  if (req.body.tags !== undefined) tutorial.tags = toArray(req.body.tags);

  const coverFile = req.files?.coverImage?.[0];
  const newCover = req.body.coverImageText?.trim() || coverFile?.path;
  if (newCover) {
    destroyCloudinaryAsset(tutorial.coverImage);
    tutorial.coverImage = newCover;
  }

  await tutorial.save();
  res.json({ data: tutorial });
});

export const deleteTutorial = asyncHandler(async (req, res) => {
  const tutorial = await Tutorial.findById(req.params.id);
  if (!tutorial) { res.status(404); throw new Error('Tutorial not found'); }
  if (req.user.role !== 'admin' && tutorial.postedBy.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  destroyCloudinaryAsset(tutorial.coverImage);
  await tutorial.deleteOne();
  res.json({ message: 'Tutorial deleted' });
});
