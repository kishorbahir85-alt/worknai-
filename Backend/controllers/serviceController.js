import Service from '../models/serviceModel.js';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/services (Public)
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/services/manage (Admin/Manager)
export const getManageServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/services/:slugOrId (Public / Manage)
export const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let service = await Service.findOne({ slug });
    if (!service && /^[0-9a-fA-F]{24}$/.test(slug)) {
      service = await Service.findById(slug);
    }
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/services (Admin/Manager)
export const createService = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug) data.slug = slugify(data.title);
    if (typeof data.features === 'string') data.features = data.features.split(',').map((s) => s.trim()).filter(Boolean);
    if (typeof data.deliverables === 'string') data.deliverables = data.deliverables.split(',').map((s) => s.trim()).filter(Boolean);
    if (typeof data.techStack === 'string') data.techStack = data.techStack.split(',').map((s) => s.trim()).filter(Boolean);
    if (typeof data.processSteps === 'string') {
      try { data.processSteps = JSON.parse(data.processSteps); } catch { data.processSteps = []; }
    }

    const created = await Service.create(data);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/services/:id (Admin/Manager)
export const updateService = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.title && !data.slug) data.slug = slugify(data.title);
    if (typeof data.features === 'string') data.features = data.features.split(',').map((s) => s.trim()).filter(Boolean);
    if (typeof data.deliverables === 'string') data.deliverables = data.deliverables.split(',').map((s) => s.trim()).filter(Boolean);
    if (typeof data.techStack === 'string') data.techStack = data.techStack.split(',').map((s) => s.trim()).filter(Boolean);
    if (typeof data.processSteps === 'string') {
      try { data.processSteps = JSON.parse(data.processSteps); } catch { data.processSteps = []; }
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/services/:id (Admin/Manager)
export const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
