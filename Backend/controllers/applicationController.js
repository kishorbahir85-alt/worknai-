import asyncHandler from 'express-async-handler';
import Application from '../models/applicationModel.js';
import Job from '../models/jobModel.js';
import { sendLeadToCrm } from '../utils/crm.js';

export const applyForJob = asyncHandler(async (req, res) => {
  const { jobId, applicantName, applicantEmail, phone, experience, currentRole, coverLetter, source } = req.body;
  if (!applicantName || !applicantEmail || !experience) {
    res.status(400); throw new Error('Name, email and experience are required');
  }

  const isJoinUs = source === 'join-us' || !jobId;

  if (!isJoinUs) {
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) { res.status(404); throw new Error('Job not found or no longer active'); }
  }

  const resumeUrl = req.files?.resume?.[0] ? `/uploads/resumes/${req.files.resume[0].filename}` : '';
  const coverLetterUrl = req.files?.coverLetterFile?.[0] ? `/uploads/coverletters/${req.files.coverLetterFile[0].filename}` : '';

  const application = await Application.create({
    user: req.user?._id || null,
    job: isJoinUs ? null : jobId,
    source: source || '',
    applicantName,
    applicantEmail,
    phone: phone || '',
    experience,
    currentRole: currentRole || '',
    coverLetter: coverLetter || '',
    resumeUrl,
    coverLetterUrl,
  });

  // Fire-and-forget CRM sync for join-us job inquiries; never blocks or fails the submission.
  if (isJoinUs) {
    sendLeadToCrm({
      name: applicantName,
      email: applicantEmail,
      phone: phone || '',
      message: coverLetter || '',
      formType: 'job-inquiry',
      position: currentRole || '',
      experience,
    });
  }

  res.status(201).json({ data: application });
});

// HR/Manager: get all applications for a specific job
export const getJobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) { res.status(404); throw new Error('Job not found'); }

  // HR/Manager can only see applications for jobs they posted (admin sees all)
  if (req.user.role !== 'admin' && job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate('user', 'name email avatar')
    .sort({ createdAt: -1 });
  res.json({ data: applications });
});

// HR/Manager: get all applications across all jobs they manage
export const getAllApplications = asyncHandler(async (req, res) => {
  let jobFilter = {};
  if (req.user.role !== 'admin') {
    const myJobs = await Job.find({ postedBy: req.user._id }).select('_id');
    jobFilter = { job: { $in: myJobs.map((j) => j._id) } };
  }

  const applications = await Application.find(jobFilter)
    .populate('user', 'name email avatar')
    .populate('job', 'title slug location type')
    .sort({ createdAt: -1 });
  res.json({ data: applications });
});

// HR/Manager: update status + interview schedule
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, interviewDate, interviewTime, interviewNote } = req.body;
  const application = await Application.findById(req.params.id).populate('job');
  if (!application) { res.status(404); throw new Error('Application not found'); }

  // Only the job poster or admin can update
  if (
    req.user.role !== 'admin' &&
    application.job.postedBy.toString() !== req.user._id.toString()
  ) {
    res.status(403); throw new Error('Not authorized');
  }

  if (status) application.status = status;
  if (interviewDate !== undefined) application.interview.date = interviewDate;
  if (interviewTime !== undefined) application.interview.time = interviewTime;
  if (interviewNote !== undefined) application.interview.note = interviewNote;

  await application.save();
  res.json({ data: application });
});
