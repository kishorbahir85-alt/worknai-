import Company from '../models/companyModel.js';

// GET /api/company (Public)
export const getCompany = async (req, res) => {
  try {
    let company = await Company.findOne();
    if (!company) {
      company = await Company.create({});
    }
    res.json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/company (Admin only)
export const updateCompany = async (req, res) => {
  try {
    let company = await Company.findOne();
    const payload = { ...req.body };
    if (payload.socialLinks && !payload.socials) {
      payload.socials = payload.socialLinks;
    }
    if (!company) {
      company = await Company.create(payload);
    } else {
      company = await Company.findByIdAndUpdate(company._id, payload, { new: true, runValidators: true });
    }
    res.json({ success: true, data: company });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
