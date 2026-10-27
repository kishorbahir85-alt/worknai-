import Template from '../models/templateModel.js';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/templates (Public)
export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ isFeatured: -1, createdAt: -1 });
    res.json({ success: true, data: templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/templates/:slugOrId (Public / Manage)
export const getTemplateBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let template = await Template.findOne({ slug });
    if (!template && /^[0-9a-fA-F]{24}$/.test(slug)) {
      template = await Template.findById(slug);
    }
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, data: template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/templates (Admin/Manager)
export const createTemplate = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug) data.slug = slugify(data.title);
    if (typeof data.features === 'string') data.features = data.features.split(',').map((s) => s.trim()).filter(Boolean);
    if (typeof data.techStack === 'string') data.techStack = data.techStack.split(',').map((s) => s.trim()).filter(Boolean);

    const created = await Template.create(data);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/templates/:id (Admin/Manager)
export const updateTemplate = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.title && !data.slug) data.slug = slugify(data.title);
    if (typeof data.features === 'string') data.features = data.features.split(',').map((s) => s.trim()).filter(Boolean);
    if (typeof data.techStack === 'string') data.techStack = data.techStack.split(',').map((s) => s.trim()).filter(Boolean);

    const updated = await Template.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/templates/:id (Admin/Manager)
export const deleteTemplate = async (req, res) => {
  try {
    const deleted = await Template.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
