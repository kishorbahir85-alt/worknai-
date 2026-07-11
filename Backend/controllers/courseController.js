import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';
import { slugify } from '../utils/slugify.js';

// Never expose videoUrl to public; hide amounts when showPrice is off
const toPublicCourse = (course) => {
  const { videoUrl, ...data } = course.toObject();
  if (data.showPrice === false) { delete data.price; delete data.discountPrice; }
  return data;
};

// PUBLIC — get all active courses
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isActive: true })
    .populate('postedBy', 'name role')
    .sort('-createdAt');
  res.json({ data: courses.map(toPublicCourse) });
});

// PUBLIC — get single course by slug (no video)
export const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug, isActive: true }).populate('postedBy', 'name role');
  if (!course) { res.status(404); throw new Error('Course not found'); }
  res.json({ data: toPublicCourse(course) });
});

// PROTECTED — get course content (video) only for enrolled users
export const getCourseContent = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug, isActive: true });
  if (!course) { res.status(404); throw new Error('Course not found'); }

  // Check enrollment
  const Enrollment = (await import('../models/enrollmentModel.js')).default;
  const enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id });
  if (!enrollment) { res.status(403); throw new Error('You are not enrolled in this course'); }
  if (enrollment.paymentStatus === 'pending' && course.price > 0) {
    res.status(403); throw new Error('Payment pending. Please complete payment to access content');
  }

  res.json({ data: course });
});

// PROTECTED — get all courses for management (admin sees all, others see own)
export const getManageCourses = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { postedBy: req.user._id };
  const courses = await Course.find(filter)
    .populate('postedBy', 'name email role')
    .sort('-createdAt');
  res.json({ data: courses });
});

const uniqueSlug = async (title) => {
  let base = slugify(title);
  let slug = base;
  let i = 1;
  while (await Course.exists({ slug })) { slug = `${base}-${i++}`; }
  return slug;
};

const normalizeDateString = (value) => {
  if (!value) return '';
  const text = String(value).trim();
  if (!text) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const localMatch = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (localMatch) {
    const [, day, month, year] = localMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const date = new Date(text);
  if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  return text;
};

const normalizeBatches = (batches = []) => (
  Array.isArray(batches)
    ? batches.map((batch) => ({
      ...batch,
      startDate: normalizeDateString(batch.startDate),
      totalSeats: Number(batch.totalSeats) || 0,
      enrolledCount: Number(batch.enrolledCount) || 0,
    }))
    : []
);

export const createCourse = asyncHandler(async (req, res) => {
  const {
    title, shortDescription, description, icon, category, duration,
    startDate, price, discountPrice, showPrice, level, mode, videoUrl, batches, featured,
  } = req.body;
  if (!title) { res.status(400); throw new Error('Title is required'); }
  const course = await Course.create({
    title,
    slug: await uniqueSlug(title),
    shortDescription: shortDescription || '',
    description: description || '',
    icon: icon || '📚',
    category: category || '',
    duration: duration || '',
    startDate: normalizeDateString(startDate),
    price: Number(price) || 0,
    discountPrice: Number(discountPrice) || 0,
    showPrice: showPrice !== false && showPrice !== 'false',
    level: level || 'beginner',
    mode: mode || 'offline',
    videoUrl: videoUrl || '',
    batches: normalizeBatches(batches),
    featured: featured || false,
    postedBy: req.user._id,
  });
  res.status(201).json({ data: course });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) { res.status(404); throw new Error('Course not found'); }
  if (req.user.role !== 'admin' && course.postedBy.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  const fields = [
    'title', 'shortDescription', 'description', 'icon', 'category',
    'duration', 'price', 'discountPrice', 'level', 'mode',
    'isActive', 'videoUrl', 'featured',
  ];
  fields.forEach(f => { if (req.body[f] !== undefined) course[f] = req.body[f]; });
  if (req.body.startDate !== undefined) course.startDate = normalizeDateString(req.body.startDate);
  if (req.body.batches !== undefined) course.batches = normalizeBatches(req.body.batches);
  if (req.body.price !== undefined)         course.price         = Number(req.body.price) || 0;
  if (req.body.discountPrice !== undefined) course.discountPrice = Number(req.body.discountPrice) || 0;
  if (req.body.showPrice !== undefined)     course.showPrice     = req.body.showPrice !== false && req.body.showPrice !== 'false';
  await course.save();
  res.json({ data: course });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) { res.status(404); throw new Error('Course not found'); }
  if (req.user.role !== 'admin' && course.postedBy.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  await course.deleteOne();
  res.json({ message: 'Course deleted' });
});
