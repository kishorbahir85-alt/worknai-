import mongoose from 'mongoose';

const trendingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    type: {
      type: String,
      enum: ['overview', 'our-approach', 'success-story', 'expert-voice', 'innovation'],
      default: 'success-story',
    },
    category: { type: String, default: 'AI & Automation' },
    summary: { type: String, default: '' },
    content: { type: String, default: '' },
    author: {
      name: { type: String, default: 'WorknAi Research' },
      role: { type: String, default: 'Lead AI Architect' },
      avatar: { type: String, default: '' },
    },
    clientName: { type: String, default: '' },
    clientLogo: { type: String, default: '' },
    results: [{ type: String }],
    metrics: {
      stat1: { label: { type: String, default: '' }, value: { type: String, default: '' } },
      stat2: { label: { type: String, default: '' }, value: { type: String, default: '' } },
      stat3: { label: { type: String, default: '' }, value: { type: String, default: '' } },
    },
    tags: [{ type: String }],
    coverImage: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Trending = mongoose.model('Trending', trendingSchema);
export default Trending;
