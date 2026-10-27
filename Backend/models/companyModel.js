import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, default: 'WorknAi Logistics & AI Labs' },
    heroHeading: { type: String, default: 'Empowering Next-Gen AI & Logistics Innovation' },
    heroSubheading: { type: String, default: 'Building intelligent digital products, enterprise platforms, and workforce solutions for global scale.' },
    aboutStory: { type: String, default: '' },
    mission: { type: String, default: '' },
    vision: { type: String, default: '' },
    email: { type: String, default: 'contact@worknai.online' },
    phone: { type: String, default: '+91 84469 12345' },
    address: { type: String, default: 'Pune, Maharashtra, India' },
    socials: {
      linkedin: { type: String, default: 'https://in.linkedin.com/in/worknai-technology-8830973b6' },
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
      instagram: { type: String, default: 'https://www.instagram.com/worknai_institute_center/' },
      youtube: { type: String, default: 'https://www.youtube.com/@Worknai-w5m' },
      facebook: { type: String, default: 'https://www.facebook.com/profile.php?id=61595453355907' },
    },
    metrics: [
      {
        label: { type: String, default: '' },
        value: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    team: [
      {
        name: { type: String, default: '' },
        role: { type: String, default: '' },
        avatar: { type: String, default: '' },
        bio: { type: String, default: '' },
        linkedin: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

const Company = mongoose.model('Company', companySchema);
export default Company;
