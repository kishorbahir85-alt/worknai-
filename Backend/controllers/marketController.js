import MarketProduct from '../models/marketProductModel.js';
import MarketUpdate from '../models/marketUpdateModel.js';
import MarketConfig from '../models/marketConfigModel.js';
import { scrapeProductFromUrl } from '../utils/urlProductScraper.js';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// @desc    Get all verified physical marketplace products with filtering & sorting
// @route   GET /api/emarket
// @access  Public
export const getMarketProducts = async (req, res) => {
  try {
    const { category, brand, search, featured, sort = 'latest', limit = 1000 } = req.query;
    
    // Strict verification filter for public consumption
    const query = {
      verificationStatus: 'verified',
      isAvailable: true,
    };

    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (brand && brand !== 'all') {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { subcategory: { $regex: q, $options: 'i' } },
        { tagline: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'specifications.value': { $regex: q, $options: 'i' } },
      ];
    }

    // Sort: 'latest' uses updatedAt and releaseDate
    let sortOptions = { updatedAt: -1, releaseDate: -1, createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1, releaseDate: -1 };
    if (sort === 'price_desc') sortOptions = { price: -1, releaseDate: -1 };
    if (sort === 'name') sortOptions = { title: 1 };
    if (sort === 'oldest') sortOptions = { releaseDate: 1, createdAt: 1 };

    const products = await MarketProduct.find(query)
      .sort(sortOptions)
      .limit(Number(limit) || 1000)
      .lean();

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    console.error('Error in getMarketProducts:', err);
    res.status(500).json({ success: false, message: 'Server error loading marketplace products' });
  }
};

// @desc    Get single marketplace product by slug (verified only)
// @route   GET /api/emarket/:slug
// @access  Public
export const getMarketProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const cleanSlug = String(slug || '').toLowerCase().trim();
    
    // 1. Exact slug match
    let product = await MarketProduct.findOne({
      slug: cleanSlug,
      verificationStatus: 'verified',
    }).lean();

    // 2. ObjectId match
    if (!product && cleanSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await MarketProduct.findOne({
        _id: cleanSlug,
        verificationStatus: 'verified',
      }).lean();
    }

    // 3. Fallback: fuzzy/prefix/token match against verified products
    if (!product) {
      const allVerified = await MarketProduct.find({ verificationStatus: 'verified' }).lean();
      
      // 3a. Direct prefix/substring match
      product = allVerified.find(p => cleanSlug.startsWith(p.slug) || p.slug.startsWith(cleanSlug) || cleanSlug.includes(p.slug) || p.slug.includes(cleanSlug));
      
      // 3b. Token overlap match (e.g. meta-quest matches meta-quest-vr-headsets-and-accessories)
      if (!product) {
        const queryTokens = cleanSlug.split('-').filter(t => t.length > 2);
        let bestMatch = null;
        let maxOverlap = 0;
        for (const p of allVerified) {
          const productTokens = (p.slug + ' ' + (p.title || '').toLowerCase()).split(/[\s-]+/);
          const overlap = queryTokens.filter(t => productTokens.includes(t)).length;
          if (overlap > maxOverlap && overlap >= 2) {
            maxOverlap = overlap;
            bestMatch = p;
          }
        }
        if (bestMatch) {
          product = bestMatch;
        }
      }
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Verified technology product not found' });
    }

    // Related products in the same category
    const related = await MarketProduct.find({
      category: product.category,
      _id: { $ne: product._id },
      verificationStatus: 'verified',
      isAvailable: true,
    })
      .sort({ releaseDate: -1 })
      .limit(4)
      .lean();

    res.json({
      success: true,
      data: product,
      related,
    });
  } catch (err) {
    console.error('Error in getMarketProductBySlug:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get category and brand facets from verified products only
// @route   GET /api/emarket/meta/facets
// @access  Public
export const getMarketFacets = async (req, res) => {
  try {
    const matchVerified = { verificationStatus: 'verified', isAvailable: true };

    const categories = await MarketProduct.aggregate([
      { $match: matchVerified },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const brands = await MarketProduct.aggregate([
      { $match: matchVerified },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        categories: categories.map((c) => ({ name: c._id, count: c.count })),
        brands: brands.map((b) => ({ name: b._id, count: b.count })),
      },
    });
  } catch (err) {
    console.error('Error in getMarketFacets:', err);
    res.status(500).json({ success: false, message: 'Server error loading facets' });
  }
};

// ==========================================
// TECHNOLOGY UPDATES (SEPARATE FROM PRODUCTS)
// ==========================================

// @desc    Get all verified technology updates
// @route   GET /api/emarket/updates
// @access  Public
export const getMarketUpdates = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    const query = { isVerified: true };

    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    const updates = await MarketUpdate.find(query)
      .sort({ publishedAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      count: updates.length,
      data: updates,
    });
  } catch (err) {
    console.error('Error in getMarketUpdates:', err);
    res.status(500).json({ success: false, message: 'Server error loading technology updates' });
  }
};

// ==========================================
// ADMIN MANAGEMENT (CRUD + VERIFICATION)
// ==========================================

// @desc    Get all products for Admin (including needs_review, unavailable)
// @route   GET /api/emarket/admin/all
// @access  Private (Admin / Manager)
export const getAdminMarketProducts = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.verificationStatus = status;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
      ];
    }

    const products = await MarketProduct.find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    console.error('Error in getAdminMarketProducts:', err);
    res.status(500).json({ success: false, message: 'Server error loading admin products' });
  }
};

// Helper: Generate a guaranteed unique slug in the database
async function ensureUniqueSlug(baseSlug) {
  let candidate = baseSlug;
  let collision = await MarketProduct.findOne({ slug: candidate });
  let attempts = 0;
  while (collision && attempts < 20) {
    candidate = `${baseSlug}-${Date.now().toString().slice(-6)}`;
    collision = await MarketProduct.findOne({ slug: candidate });
    attempts++;
  }
  return candidate;
}

// @desc    Create new marketplace physical hardware product
// @route   POST /api/emarket
// @access  Private (Admin / Manager)
export const createMarketProduct = async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.slug) {
      body.slug = slugify(body.title);
    }
    if (req.user) {
      body.postedBy = req.user._id;
    }

    // Always generate a unique slug so we never overwrite
    body.slug = await ensureUniqueSlug(body.slug);

    body.lastVerifiedAt = new Date();
    if (body.price) {
      body.priceLastVerifiedAt = new Date();
    }

    const product = await MarketProduct.create(body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.error('Error creating market product:', err);
    res.status(400).json({ success: false, message: err.message || 'Validation error' });
  }
};

// @desc    Update marketplace product
// @route   PUT /api/emarket/:id
// @access  Private (Admin / Manager)
export const updateMarketProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };
    if (body.title && !body.slug) {
      body.slug = slugify(body.title);
    }

    if (body.price) {
      body.priceLastVerifiedAt = new Date();
    }
    body.lastVerifiedAt = new Date();

    const updated = await MarketProduct.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error updating market product:', err);
    res.status(400).json({ success: false, message: err.message || 'Update error' });
  }
};

// @desc    Delete marketplace product
// @route   DELETE /api/emarket/:id
// @access  Private (Admin / Manager)
export const deleteMarketProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MarketProduct.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Marketplace product deleted' });
  } catch (err) {
    console.error('Error deleting market product:', err);
    res.status(500).json({ success: false, message: 'Delete error' });
  }
};

// @desc    Scrape URL for preview
// @route   POST /api/emarket/scrape-url
// @access  Private (Admin / Manager)
export const scrapeProductUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'URL is required' });
    }

    const scraped = await scrapeProductFromUrl(url);
    res.json({ success: true, data: scraped });
  } catch (err) {
    console.error('Error scraping product URL:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to extract product details from URL' });
  }
};

// @desc    Auto-import product directly from URL and publish to live user page
// @route   POST /api/emarket/auto-import
// @access  Private (Admin / Manager)
export const autoImportProductFromUrl = async (req, res) => {
  const rawUrl = (req.body?.url || '').trim();
  console.log(`[PRODUCT_IMPORT] Stage 1/6: Received import request for URL: "${rawUrl}"`);

  if (!rawUrl || !/^https?:\/\//i.test(rawUrl)) {
    console.warn(`[PRODUCT_IMPORT] FAILED stage=validation error=Invalid HTTP/HTTPS URL: "${rawUrl}"`);
    return res.status(400).json({ success: false, message: 'Please provide a valid HTTP or HTTPS product URL' });
  }

  try {
    console.log(`[PRODUCT_IMPORT] Stage 2/6: Authenticated User ID: ${req.user ? req.user._id : 'System Admin'}`);
    const cleanUrl = rawUrl.replace(/\/+$/, '');

    // Extract product details and download official image
    console.log(`[PRODUCT_IMPORT] Stage 3/6: Initiating product extraction & image downloader...`);
    const scraped = await scrapeProductFromUrl(rawUrl);

    if (req.body.category) scraped.category = req.body.category;
    if (req.body.price !== undefined && req.body.price !== null && req.body.price !== '') scraped.price = Number(req.body.price);
    if (req.body.isFeatured !== undefined) scraped.isFeatured = Boolean(req.body.isFeatured);

    if (req.user) {
      scraped.postedBy = req.user._id;
    }

    console.log(`[PRODUCT_IMPORT] Stage 4/6: Extracted product "${scraped.title}" (Brand: ${scraped.brand}, Category: ${scraped.category}, Price: ₹${scraped.price})`);

    // Match by exact URL, or URL with/without trailing slash
    console.log(`[PRODUCT_IMPORT] Stage 5/6: Performing duplicate check against database...`);
    let existing = await MarketProduct.findOne({
      $or: [
        { sourceProductUrl: rawUrl },
        { sourceProductUrl: cleanUrl },
        { sourceProductUrl: `${cleanUrl}/` }
      ]
    });

    let savedProduct;
    let isDuplicateUpdate = false;

    if (existing) {
      console.log(`[PRODUCT_IMPORT] Duplicate match found (ID: ${existing._id}). Updating existing product record...`);
      savedProduct = await MarketProduct.findByIdAndUpdate(existing._id, scraped, { new: true, runValidators: true });
      isDuplicateUpdate = true;
    } else {
      console.log(`[PRODUCT_IMPORT] No duplicate URL match found. Creating brand new product entry...`);
      const baseSlug = scraped.slug || slugify(scraped.title || 'hardware-product');
      scraped.slug = await ensureUniqueSlug(baseSlug);
      savedProduct = await MarketProduct.create(scraped);
    }

    const totalCount = await MarketProduct.countDocuments();
    console.log(`[PRODUCT_IMPORT] Stage 6/6: SUCCESS. Product ID "${savedProduct._id}" saved to MongoDB. Total DB count: ${totalCount}`);

    const message = isDuplicateUpdate
      ? `Updated existing product "${savedProduct.title}" with latest specs & pricing! (Total: ${totalCount} products)`
      : `Successfully imported "${savedProduct.title}" to Live Marketplace! (Total: ${totalCount} products)`;

    res.status(201).json({
      success: true,
      message,
      isUpdated: isDuplicateUpdate,
      data: savedProduct,
    });
  } catch (err) {
    console.error(`[PRODUCT_IMPORT] FAILED stage=controller_error error=${err.message}`, err);
    res.status(500).json({ success: false, message: err.message || 'Auto import failed due to server error' });
  }
};

const DEFAULT_PAGE_CONFIG = {
  heroTitle: 'Real Technology for a Smarter Tomorrow.',
  heroSubtitle: 'Explore and buy genuine robotics, AI hardware, smart devices, development boards and electronics from trusted global brands — now easily accessible in India.',
  badgeText: 'Verified Real-World Technology Marketplace',
  searchPlaceholder: 'Search products, brands, or categories...',
  trendingKeywords: ['Unitree Go2', 'Apple Vision Pro', 'NVIDIA Jetson', 'Raspberry Pi 5', 'DJI Mini 4'],
  categories: [
    {
      id: 'Everyday AI',
      label: 'Everyday AI',
      subtitle: 'Smart Wearables, Glasses & AI Devices',
      image: '/emarket/products/ray-ban-meta-smart-glasses-gen-2.jpg',
    },
    {
      id: 'Smart Home',
      label: 'Smart Home',
      subtitle: 'Smarter Homes, Automation & IoT Hubs',
      image: '/emarket/products/home-assistant-green.jpg',
    },
    {
      id: 'Robotics',
      label: 'Robotics',
      subtitle: 'Humanoids, Quadrupeds & AI Drones',
      image: '/emarket/products/unitree-go2-quadruped-robot.jpg',
    },
    {
      id: 'AI Hardware & Dev Boards',
      label: 'AI Hardware & Dev Boards',
      subtitle: 'Edge AI Compute & Single Board Computers',
      image: '/emarket/products/nvidia-jetson-orin-nano-developer-kit.jpg',
    },
  ],
  valueProps: [
    { label: '500+', desc: 'Verified Products' },
    { label: '50+', desc: 'Global Brands' },
    { label: '100%', desc: 'Authentic Sources' },
    { label: 'Fast', desc: 'India Delivery Info' },
  ],
  featuredTitle: 'Featured Products',
  featuredSubtitle: "Handpicked innovations from the world's leading technology brands.",
};

// @desc    Get AI Market page CMS configuration
// @route   GET /api/emarket/page-config
// @access  Public
export const getMarketPageConfig = async (req, res) => {
  try {
    let config = await MarketConfig.findOne({ key: 'main_page_config' });
    if (!config) {
      config = await MarketConfig.create({ key: 'main_page_config', ...DEFAULT_PAGE_CONFIG });
    } else {
      let needsSave = false;
      if (!config.categories || config.categories.length === 0) {
        config.categories = DEFAULT_PAGE_CONFIG.categories;
        needsSave = true;
      }
      if (!config.valueProps || config.valueProps.length === 0) {
        config.valueProps = DEFAULT_PAGE_CONFIG.valueProps;
        needsSave = true;
      }
      if (!config.trendingKeywords || config.trendingKeywords.length === 0) {
        config.trendingKeywords = DEFAULT_PAGE_CONFIG.trendingKeywords;
        needsSave = true;
      }
      if (!config.heroTitle) { config.heroTitle = DEFAULT_PAGE_CONFIG.heroTitle; needsSave = true; }
      if (!config.heroSubtitle) { config.heroSubtitle = DEFAULT_PAGE_CONFIG.heroSubtitle; needsSave = true; }
      if (!config.badgeText) { config.badgeText = DEFAULT_PAGE_CONFIG.badgeText; needsSave = true; }
      if (!config.searchPlaceholder) { config.searchPlaceholder = DEFAULT_PAGE_CONFIG.searchPlaceholder; needsSave = true; }
      if (!config.featuredTitle) { config.featuredTitle = DEFAULT_PAGE_CONFIG.featuredTitle; needsSave = true; }
      if (!config.featuredSubtitle) { config.featuredSubtitle = DEFAULT_PAGE_CONFIG.featuredSubtitle; needsSave = true; }

      if (needsSave) {
        await config.save();
      }
    }
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Save/Update AI Market page CMS configuration
// @route   POST /api/emarket/page-config
// @access  Private/Admin
export const saveMarketPageConfig = async (req, res) => {
  try {
    const data = req.body;
    let config = await MarketConfig.findOneAndUpdate(
      { key: 'main_page_config' },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'AI Market page config saved successfully', data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

