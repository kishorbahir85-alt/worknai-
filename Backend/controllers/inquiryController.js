import asyncHandler from 'express-async-handler';
import Inquiry from '../models/inquiryModel.js';
import Product from '../models/productModel.js';
import { syncLeadToCrm } from '../utils/crmSync.js';
import { buildBusinessInquiryCrmPayload, buildProductInquiryCrmPayload } from '../utils/inquiryCrmPayload.js';

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

  // Product, purchase, and investor inquiries all use billpay.business's
  // supported business_inquiry contract, with their category in serviceRequired.
  if (product) {
    const productRecord = await Product.findById(product).select('title').lean();
    void syncLeadToCrm(buildProductInquiryCrmPayload({
      inquiry,
      productTitle: productRecord?.title,
    }));
  } else if (source === 'join-us') {
    // Fire-and-forget CRM sync; a CRM outage must not fail the local submission.
    void syncLeadToCrm(buildBusinessInquiryCrmPayload({
      name,
      email,
      phone: phone || '',
      company: company || '',
      serviceRequired: type || '',
      message: inquiry.message,
    }));
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
