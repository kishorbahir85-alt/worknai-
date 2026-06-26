import asyncHandler from 'express-async-handler';
import Enrollment from '../models/enrollmentModel.js';
import Course from '../models/courseModel.js';

const generateAccessCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'WN-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

// User: enroll in a course
export const enrollCourse = asyncHandler(async (req, res) => {
  const { courseId, batchId, studentDetails, transactionRef } = req.body;
  if (!courseId) { res.status(400); throw new Error('Course ID is required'); }

  const course = await Course.findById(courseId);
  if (!course || !course.isActive) { res.status(404); throw new Error('Course not found'); }

  const existing = await Enrollment.findOne({ user: req.user._id, course: courseId });
  if (existing) { res.status(400); throw new Error('Already enrolled in this course'); }

  // Batch handling for offline/hybrid
  let batchName = '';
  if (batchId && (course.mode === 'offline' || course.mode === 'hybrid')) {
    const batch = course.batches.id(batchId);
    if (!batch) { res.status(400); throw new Error('Selected batch not found'); }
    if (batch.totalSeats > 0 && batch.enrolledCount >= batch.totalSeats) {
      res.status(400); throw new Error('This batch is full');
    }
    batchName = batch.name;
    batch.enrolledCount += 1;
    await course.save();
  }

  const isFree = course.price === 0 || (course.discountPrice > 0 && course.discountPrice === 0);
  const amount = course.discountPrice > 0 ? course.discountPrice : course.price;

  const enrollment = await Enrollment.create({
    user: req.user._id,
    course: courseId,
    enrollmentType: course.mode,
    amount,
    paymentStatus: amount === 0 ? 'free' : 'pending',
    accessCode: amount === 0 && course.mode === 'online' ? generateAccessCode() : '',
    batchId: batchId || null,
    batchName,
    studentDetails: studentDetails || {},
    transactionRef: transactionRef || '',
  });

  res.status(201).json({ data: enrollment });
});

// User: get my enrollments
export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id })
    .populate('course', 'title slug shortDescription category level mode duration startDate price discountPrice videoUrl isActive icon')
    .sort({ createdAt: -1 });
  res.json({ data: enrollments });
});

// User: check if enrolled in a specific course
export const checkEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId });
  res.json({ data: { enrolled: !!enrollment, enrollment } });
});

// HR/Manager/Admin: get all enrollments
export const getCourseEnrollments = asyncHandler(async (req, res) => {
  let courseFilter = {};
  if (req.user.role !== 'admin') {
    const myCourses = await Course.find({ postedBy: req.user._id }).select('_id');
    courseFilter = { course: { $in: myCourses.map((c) => c._id) } };
  }
  const enrollments = await Enrollment.find(courseFilter)
    .populate('user', 'name email avatar')
    .populate('course', 'title slug price mode')
    .sort({ createdAt: -1 });
  res.json({ data: enrollments });
});

// HR/Manager/Admin: update offline course application status
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationStatus, statusNote } = req.body;
  const allowed = ['pending', 'approved', 'rejected', 'confirmed'];
  if (!allowed.includes(applicationStatus)) { res.status(400); throw new Error('Invalid application status'); }

  const enrollment = await Enrollment.findById(req.params.id).populate('course');
  if (!enrollment) { res.status(404); throw new Error('Enrollment not found'); }

  if (enrollment.enrollmentType !== 'offline') { res.status(400); throw new Error('Application status is only for offline courses'); }

  // admin / manager / hr — all allowed (authorize middleware already guards the route)

  enrollment.applicationStatus = applicationStatus;
  if (statusNote !== undefined) enrollment.statusNote = statusNote;
  await enrollment.save();
  res.json({ data: enrollment });
});

// HR/Manager/Admin: confirm payment → auto-generate access code for online
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus, paymentId } = req.body;
  const enrollment = await Enrollment.findById(req.params.id).populate('course');
  if (!enrollment) { res.status(404); throw new Error('Enrollment not found'); }

  if (req.user.role !== 'admin' && enrollment.course.postedBy.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }

  if (paymentStatus) enrollment.paymentStatus = paymentStatus;
  if (paymentId) enrollment.paymentId = paymentId;

  // Auto-generate access code when payment confirmed for online/hybrid
  if (paymentStatus === 'paid' && !enrollment.accessCode &&
      (enrollment.enrollmentType === 'online' || enrollment.enrollmentType === 'hybrid')) {
    enrollment.accessCode = generateAccessCode();
  }

  await enrollment.save();
  res.json({ data: enrollment });
});
