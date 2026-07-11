import mongoose from 'mongoose';

const  EnquirySchema = mongoose.Schema(
  {
    name:        { type: String, required: true },
    company:     { type: String, default: '' },
    email:       { type: String, required: true },
    phone:       { type: String, default: '' },
    type:        { type: String, default: '' },
    message:     { type: String, required: true },
    source:      { type: String, default: '' },
    status:      { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
    product:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    course:      { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
    qualification: { type: String, default: '' },
    address:     { type: String, default: '' },
  },
  { timestamps: true }
);

const  Enquiry = mongoose.model(' Enquiry',  EnquirySchema);
export default  Enquiry;
