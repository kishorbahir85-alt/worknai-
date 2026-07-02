import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { slugify } from '../utils/slugify.js';
import cloudinary, { ensureCloudinaryConfigured } from '../config/cloudinary.js';

const publicIdFromUrl = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  const afterUpload = url.split('/upload/')[1];
  if (!afterUpload) return null;
  const withoutVersion = afterUpload.replace(/^v\d+\//, '');
  return withoutVersion.replace(/\.[^./]+$/, '');
};

const destroyCloudinaryAsset = (url) => {
  const publicId = publicIdFromUrl(url);
  if (!publicId) return;
  ensureCloudinaryConfigured();
  const resourceType = /\/video\/upload\//.test(url) ? 'video' : 'image';
  cloudinary.uploader.destroy(publicId, { resource_type: resourceType }).catch(() => {});
};

const destroyCloudinaryAssets = (urls) => {
  if (!Array.isArray(urls)) return;
  urls.forEach(destroyCloudinaryAsset);
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) return value.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

const toJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true })
    .populate('postedBy', 'name role')
    .sort('-createdAt');
  res.json({ data: products });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('postedBy', 'name role');
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ data: product });
});

export const getManageProducts = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { postedBy: req.user._id };
  const products = await Product.find(filter)
    .populate('postedBy', 'name email role')
    .sort('-createdAt');
  res.json({ data: products });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, category, url, techStack, videoUrl, features, benefits, howItWorks, faqs, tagline,
    logoUrlText, heroImageText, heroVideoText, galleryUrls, overviewImageText, benefitsImageText } = req.body;
  if (!title) { res.status(400); throw new Error('Title is required'); }
  const logoFile = req.files?.logo?.[0];
  const galleryFiles = req.files?.gallery || [];
  const heroImageFile = req.files?.heroImage?.[0];
  const heroVideoFile = req.files?.heroVideo?.[0];
  const overviewImageFile = req.files?.overviewImage?.[0];
  const benefitsImageFile = req.files?.benefitsImage?.[0];
  const product = await Product.create({
    title, slug: slugify(title), description, category, url,
    logoUrl: logoUrlText?.trim() || logoFile?.path || '',
    gallery: [...toArray(galleryUrls), ...galleryFiles.map((f) => f.path)],
    videoUrl: videoUrl || '',
    heroImage: heroImageText?.trim() || heroImageFile?.path || '',
    heroVideo: heroVideoText?.trim() || heroVideoFile?.path || '',
    overviewImage: overviewImageText?.trim() || overviewImageFile?.path || '',
    benefitsImage: benefitsImageText?.trim() || benefitsImageFile?.path || '',
    tagline: tagline || '',
    techStack: toArray(techStack),
    features: toArray(features),
    benefits: toArray(benefits),
    howItWorks: toJsonArray(howItWorks),
    faqs: toJsonArray(faqs),
    postedBy: req.user._id,
  });
  res.status(201).json({ data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  if (req.user.role !== 'admin' && product.postedBy.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  const fields = ['title', 'description', 'category', 'url', 'isActive', 'videoUrl', 'tagline'];
  fields.forEach(f => { if (req.body[f] !== undefined) product[f] = req.body[f]; });
  if (req.body.techStack !== undefined) product.techStack = toArray(req.body.techStack);
  if (req.body.features !== undefined) product.features = toArray(req.body.features);
  if (req.body.benefits !== undefined) product.benefits = toArray(req.body.benefits);
  if (req.body.howItWorks !== undefined) product.howItWorks = toJsonArray(req.body.howItWorks);
  if (req.body.faqs !== undefined) product.faqs = toJsonArray(req.body.faqs);

  const logoFile = req.files?.logo?.[0];
  const newLogo = req.body.logoUrlText?.trim() || logoFile?.path;
  if (newLogo) {
    destroyCloudinaryAsset(product.logoUrl);
    product.logoUrl = newLogo;
  }

  const heroImageFile = req.files?.heroImage?.[0];
  const newHeroImage = req.body.heroImageText?.trim() || heroImageFile?.path;
  if (newHeroImage) {
    destroyCloudinaryAsset(product.heroImage);
    product.heroImage = newHeroImage;
  }

  const heroVideoFile = req.files?.heroVideo?.[0];
  const newHeroVideo = req.body.heroVideoText?.trim() || heroVideoFile?.path;
  if (newHeroVideo) {
    destroyCloudinaryAsset(product.heroVideo);
    product.heroVideo = newHeroVideo;
  }

  const overviewImageFile = req.files?.overviewImage?.[0];
  const newOverviewImage = req.body.overviewImageText?.trim() || overviewImageFile?.path;
  if (newOverviewImage) {
    destroyCloudinaryAsset(product.overviewImage);
    product.overviewImage = newOverviewImage;
  }

  const benefitsImageFile = req.files?.benefitsImage?.[0];
  const newBenefitsImage = req.body.benefitsImageText?.trim() || benefitsImageFile?.path;
  if (newBenefitsImage) {
    destroyCloudinaryAsset(product.benefitsImage);
    product.benefitsImage = newBenefitsImage;
  }

  const galleryFiles = req.files?.gallery || [];
  if (req.body.removeGallery) {
    const toRemove = toArray(req.body.removeGallery);
    destroyCloudinaryAssets(toRemove);
    product.gallery = product.gallery.filter((g) => !toRemove.includes(g));
  }
  const newGallery = [...toArray(req.body.galleryUrls), ...galleryFiles.map((f) => f.path)];
  if (newGallery.length) {
    product.gallery = [...product.gallery, ...newGallery];
  }

  await product.save();
  res.json({ data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  if (req.user.role !== 'admin' && product.postedBy.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  destroyCloudinaryAsset(product.logoUrl);
  destroyCloudinaryAssets(product.gallery);
  destroyCloudinaryAsset(product.heroImage);
  destroyCloudinaryAsset(product.heroVideo);
  destroyCloudinaryAsset(product.overviewImage);
  destroyCloudinaryAsset(product.benefitsImage);
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
});
