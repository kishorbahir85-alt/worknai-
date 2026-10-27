import Partner from '../models/partnerModel.js';

// GET /api/partners (Public)
export const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: partners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/partners/manage (Admin/Manager)
export const getManagePartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: partners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/partners (Admin/Manager)
export const createPartner = async (req, res) => {
  try {
    const created = await Partner.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/partners/:id (Admin/Manager)
export const updatePartner = async (req, res) => {
  try {
    const updated = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/partners/:id (Admin/Manager)
export const deletePartner = async (req, res) => {
  try {
    const deleted = await Partner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, message: 'Partner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
