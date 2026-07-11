import asyncHandler from 'express-async-handler';
import  Enquiry from '../models/ EnquiryModel.js';
import Product from '../models/productModel.js';
import { syncLeadToCrm } from '../utils/crmSync.js';
import { buildBusiness EnquiryCrmPayload, buildProduct EnquiryCrmPayload } from '../utils/ EnquiryCrmPayload.js';

export const create Enquiry = asyncHandler(async (req, res) => {
  const { name, company, email, phone, type, message, source, product, course, qualification, address } = req.body;
  if (!name || !email) {
    res.status(400); throw new Error('Name and email are required');
  }
  if (!message && !course) {
    res.status(400); throw new Error('Message is required');
  }
  const  Enquiry = await  Enquiry.create({
    name, company, email, phone, type, source,
    message: message || `Interested in enrolling — please reach out with more details.`,
    product: product || null,
    course: course || null,
    qualification: qualification || '',
    address: address || '',
  });

  // Product, purchase, and investor inquiries all use billpay.business's
  // supported business_ Enquiry contract, with their category in serviceRequired.
  if (product) {
    const productRecord = await Product.findById(product).select('title').lean();
    void syncLeadToCrm(buildProduct EnquiryCrmPayload({
       Enquiry,
      productTitle: productRecord?.title,
    }));
  } else if (source === 'join-us') {
    // Fire-and-forget CRM sync; a CRM outage must not fail the local submission.
    void syncLeadToCrm(buildBusiness EnquiryCrmPayload({
      name,
      email,
      phone: phone || '',
      company: company || '',
      serviceRequired: type || '',
      message:  Enquiry.message,
    }));
  }

  res.status(201).json({ data:  Enquiry });
});

export const getAllInquiries = asyncHandler(async (req, res) => {
  const inquiries = await  Enquiry.find()
    .populate('product', 'title slug')
    .populate('course', 'title slug')
    .sort({ createdAt: -1 });
  res.json({ data: inquiries });
});

export const update EnquiryStatus = asyncHandler(async (req, res) => {
  const  Enquiry = await  Enquiry.findById(req.params.id);
  if (! Enquiry) { res.status(404); throw new Error(' Enquiry not found'); }
   Enquiry.status = req.body.status ||  Enquiry.status;
  await  Enquiry.save();
  res.json({ data:  Enquiry });
});
