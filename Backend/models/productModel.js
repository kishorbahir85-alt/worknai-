import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    title:       { type: String, required: true },
    slug:        { type: String, unique: true },
    description: { type: String, default: '' },
    category:    { type: String, default: '' },
    url:         { type: String, default: '' },
    logoUrl:     { type: String, default: '' },
    gallery:     [{ type: String }],
    videoUrl:    { type: String, default: '' },
    heroImage:   { type: String, default: '' },
    heroVideo:   { type: String, default: '' },
    overviewImage: { type: String, default: '' },
    benefitsImage: { type: String, default: '' },
    features:    [{ type: String }],
    techStack:   [{ type: String }],
    benefits:    [{ type: String }],
    howItWorks:  [{ title: String, description: String }],
    faqs:        [{ question: String, answer: String }],
    tagline:     { type: String, default: '' },
    isActive:    { type: Boolean, default: true },
    postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
