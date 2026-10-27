import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, default: 'React Starter' },
    description: { type: String, default: '' },
    features: [{ type: String }],
    techStack: [{ type: String }],
    previewUrl: { type: String, default: '' },
    downloadUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: true },
    downloadsCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Template = mongoose.model('Template', templateSchema);
export default Template;
