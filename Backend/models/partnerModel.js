import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'Technology Partner' },
    logoUrl: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    tier: { type: String, enum: ['Strategic', 'Premier', 'Standard', 'Startup'], default: 'Premier' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Partner = mongoose.model('Partner', partnerSchema);
export default Partner;
