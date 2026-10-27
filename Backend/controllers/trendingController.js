import Trending from '../models/trendingModel.js';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/trending (Public)
export const getTrending = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const items = await Trending.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/trending/:slugOrId (Public / Manage)
export const getTrendingBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let item = await Trending.findOne({ slug });
    if (!item && /^[0-9a-fA-F]{24}$/.test(slug)) {
      item = await Trending.findById(slug);
    }
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/trending (Admin/Manager)
export const createTrending = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug) data.slug = slugify(data.title);
    if (typeof data.tags === 'string') data.tags = data.tags.split(',').map((s) => s.trim()).filter(Boolean);
    if (typeof data.results === 'string') data.results = data.results.split(',').map((s) => s.trim()).filter(Boolean);

    const created = await Trending.create(data);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/trending/:id (Admin/Manager)
export const updateTrending = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.title && !data.slug) data.slug = slugify(data.title);
    if (typeof data.tags === 'string') data.tags = data.tags.split(',').map((s) => s.trim()).filter(Boolean);
    if (typeof data.results === 'string') data.results = data.results.split(',').map((s) => s.trim()).filter(Boolean);

    const updated = await Trending.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/trending/:id (Admin/Manager)
export const deleteTrending = async (req, res) => {
  try {
    const deleted = await Trending.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
