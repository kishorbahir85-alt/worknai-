import asyncHandler from 'express-async-handler';
import Inquiry from '../models/inquiryModel.js';
import { sendLeadToCrm } from '../utils/crm.js';

export const createInquiry = asyncHandler(async (req, res) => {
  const { name, company, email, phone, type, message, source, product, course, qualification, address } = req.body;
  if (!name || !email) {
    res.status(400); throw new Error('Name and email are required');
  }
  if (!message && !course) {
    res.status(400); throw new Error('Message is required');
  }
  const inquiry = await Inquiry.create({
    name, company, email, phone, type, source,
    message: message || `Interested in enrolling — please reach out with more details.`,
    product: product || null,
    course: course || null,
    qualification: qualification || '',
    address: address || '',
  });

  // Fire-and-forget CRM sync for join-us business inquiries; never blocks or fails the submission.
  if (source === 'join-us') {
    sendLeadToCrm({
      name,
      email,
      phone: phone || '',
      message: inquiry.message,
      formType: 'business-inquiry',
      companyName: company || '',
      inquiryType: type || '',
    });
  }

  res.status(201).json({ data: inquiry });
});

export const getAllInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find()
    .populate('product', 'title slug')
    .populate('course', 'title slug')
    .sort({ createdAt: -1 });
  res.json({ data: inquiries });
});

export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) { res.status(404); throw new Error('Inquiry not found'); }
  inquiry.status = req.body.status || inquiry.status;
  await inquiry.save();
  res.json({ data: inquiry });
});
