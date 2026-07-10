import express from 'express';

const router = express.Router();

const companyInfo = {
  name: 'WorknAi Technologies India Pvt Ltd',
  heroSubtitle:
    'WorknAi is an IT training, software R&D and product engineering company building careers and cutting-edge SaaS from Pune.',
  email: 'info@worknai.in',
  phone: '+91 9923400442',
  address: 'Talwade & Punawale Centers, Pune, Maharashtra',
  workingHours: 'Monday to Saturday, 10:00 AM - 7:00 PM',
  social: {
    instagram: 'https://www.instagram.com/worknai_institute_center/',
    linkedin: 'https://in.linkedin.com/in/worknai-technology-8830973b6',
  },
};

router.get('/', (req, res) => {
  res.json({ data: companyInfo });
});

export default router;
