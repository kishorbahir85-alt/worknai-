import mongoose from 'mongoose';

const marketProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, default: '' },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    price: { type: Number, default: null },
    currency: { type: String, default: 'USD' },
    priceLastVerifiedAt: { type: Date, default: null },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    features: [{ type: String }],
    source: { type: String, required: true, default: 'Manufacturer Official' },
    sourceType: {
      type: String,
      enum: ['manufacturer', 'authorized_distributor', 'official_store', 'retailer'],
      default: 'manufacturer',
    },
    sourceProductUrl: { type: String, required: true },
    buyUrl: { type: String, default: '' },
    imageSourceUrl: { type: String, default: '' },
    releaseDate: { type: Date, default: null },
    sourceUpdatedAt: { type: Date, default: null },
    specificationsLastVerifiedAt: { type: Date, default: null },
    availabilityLastVerifiedAt: { type: Date, default: null },
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    verificationStatus: {
      type: String,
      enum: ['verified', 'needs_review', 'unavailable'],
      default: 'verified',
    },
    lastVerifiedAt: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Search index
marketProductSchema.index({
  title: 'text',
  brand: 'text',
  tagline: 'text',
  description: 'text',
  'specifications.value': 'text',
});

const MarketProduct = mongoose.model('MarketProduct', marketProductSchema);
export default MarketProduct;
