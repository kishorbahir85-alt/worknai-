import mongoose from 'mongoose';

const marketConfigSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main_page_config', unique: true },
    heroTitle: { type: String },
    heroSubtitle: { type: String },
    badgeText: { type: String },
    searchPlaceholder: { type: String },
    trendingKeywords: [{ type: String }],
    categories: [
      {
        id: String,
        label: String,
        subtitle: String,
        image: String,
      },
    ],
    valueProps: [
      {
        label: String,
        desc: String,
      },
    ],
    featuredTitle: { type: String },
    featuredSubtitle: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('MarketConfig', marketConfigSchema);
