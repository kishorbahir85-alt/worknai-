import mongoose from 'mongoose';

const marketUpdateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, required: true },
    image: { type: String, default: '' },
    source: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    publishedAt: { type: Date, required: true, default: Date.now },
    category: {
      type: String,
      required: true,
      enum: ['Robotics', 'AI Hardware', 'Development Boards', 'IoT & Wireless', 'Everyday AI', 'Industry Updates'],
      default: 'Industry Updates',
    },
    tags: [{ type: String }],
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

marketUpdateSchema.index({ title: 'text', summary: 'text', tags: 'text' });

const MarketUpdate = mongoose.model('MarketUpdate', marketUpdateSchema);
export default MarketUpdate;
