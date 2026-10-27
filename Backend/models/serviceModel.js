import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    icon: { type: String, default: 'Cpu' },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    tagline: { type: String, default: '' },
    category: { type: String, default: 'Technology' },
    features: [{ type: String }],
    deliverables: [{ type: String }],
    techStack: [{ type: String }],
    processSteps: [
      {
        step: { type: Number, default: 1 },
        title: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    coverImage: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
