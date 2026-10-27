import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  let admin = await User.findOne({ role: 'admin' });
  if (!admin) admin = await User.findOne();
  const adminId = admin?._id;

  const productData = {
    title: 'InquiryExperts',
    slug: 'inquiry-experts',
    tagline: 'Trusted. Rated. Right for You — On-Demand Verified Local Services.',
    description: 'InquiryExperts (inquiry.business) connects homeowners and businesses with verified, company-managed local service professionals within 10 km. From plumbing, electrical, carpentry, painting, to appliance repair, users discover approved hyper-local offers and book guaranteed expert services.',
    category: 'Home Services & Local Marketplace',
    url: 'https://inquiry.business/',
    logoUrl: '/logos/inquiry_logo.png',
    heroImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&h=1000&fit=crop&q=80',
    overviewImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=80',
    benefitsImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80'
    ],
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS', 'Geolocation API', 'Android App'],
    features: [
      'Hyper-Local 10 KM Radius Discovery & Instant Booking',
      '100% Background-Checked & Company-Managed Experts',
      'Multi-Trade Directory: Plumbing, Electrical, Repair, Painting',
      'Transparent Upfront Pricing & Real-Time Job Tracking',
      'Verified Customer Ratings & Quality Guarantee',
      'Instant WhatsApp & App Notifications with Dedicated Support'
    ],
    benefits: [
      'Rapid response times under 30 minutes for emergencies',
      'Zero hidden fees with standardized rate cards',
      'Experienced, certified technicians equipped with modern tools',
      'Workmanship warranty on all completed service bookings'
    ],
    howItWorks: [
      { title: 'Select Your Service', description: 'Choose from plumbing, electrical, home repair, or cleaning and share your location.' },
      { title: 'Match Top-Rated Expert', description: 'Browse approved local specialists within 10 km with upfront estimates and customer reviews.' },
      { title: 'Doorstep Service & Payment', description: 'The expert arrives at your scheduled slot to complete the job with seamless digital payment.' }
    ],
    faqs: [
      { question: 'How are InquiryExperts professionals verified?', answer: 'All technicians undergo rigorous identity verification, background checks, and trade skill certifications before being assigned to jobs.' },
      { question: 'What if I need emergency repairs?', answer: 'InquiryExperts provides priority on-demand dispatch with nearby technicians arriving within 30 to 45 minutes.' }
    ],
    status: 'live',
    isActive: true,
    postedBy: adminId
  };

  const existing = await Product.findOne({
    $or: [{ slug: 'inquiry-experts' }, { title: 'InquiryExperts' }, { url: /inquiry\.business/i }]
  });

  if (existing) {
    console.log('Product already exists, updating with full details...');
    Object.assign(existing, productData);
    await existing.save();
    console.log('Updated existing product:', existing._id, existing.title);
  } else {
    console.log('Creating new product...');
    const created = await Product.create(productData);
    console.log('Created product:', created._id, created.title);
  }

  await mongoose.disconnect();
  console.log('SUCCESS: InquiryExperts product seeded!');
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
