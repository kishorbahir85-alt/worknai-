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
    title: 'GymProPlus',
    slug: 'gymproplus',
    tagline: 'Next-Generation Gym Management & Fitness ERP Platform.',
    description: 'GymProPlus is an all-in-one cloud-based gym management and fitness club ERP software. It empowers gym owners, studios, and fitness centers to automate membership plans, workout routines, trainer schedules, biometric attendance, billing, and real-time revenue analytics.',
    category: 'Health & Fitness SaaS',
    url: 'https://gymowner.gymproplus.online/gym-owner/login',
    logoUrl: '/logos/gymproplus_logo.png',
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&h=1000&fit=crop&q=80',
    overviewImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
    benefitsImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&auto=format&fit=crop&q=80'
    ],
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS', 'Google Auth', 'Biometrics & ERP'],
    features: [
      'Member Management & Biometric RFID Attendance',
      'Flexible Membership Plans & Automated Renewal Reminders',
      'Custom Workout Routines & Exercise Library Builder',
      'Trainer Scheduling & Group Fitness Batch Calendar',
      'Real-Time Revenue, Expense & Profit Analytics Reports',
      'Instant WhatsApp & SMS Fee Receipts & Invoicing'
    ],
    benefits: [
      'Zero manual bookkeeping errors',
      'Up to 40% reduction in membership churn',
      'Automated payment collections and renewal alerts',
      'Complete multi-branch gym oversight on mobile and desktop'
    ],
    howItWorks: [
      { title: 'Onboard & Setup', description: 'Configure membership tiers, trainer roles, workout plans, and facility branches in minutes.' },
      { title: 'Register Members & Biometrics', description: 'Enroll members with digital KYC, assign personal trainers, and sync access control hardware.' },
      { title: 'Automate & Grow', description: 'Monitor live check-ins, automate renewal notices, and analyze revenue growth with one-click reports.' }
    ],
    faqs: [
      { question: 'Can GymProPlus handle multiple gym branches?', answer: 'Yes! GymProPlus provides central multi-branch dashboards with location-specific reporting.' },
      { question: 'Does it support automated WhatsApp fee reminders?', answer: 'Yes, automated expiry alerts, payment confirmations, and receipt PDFs are sent directly to members via WhatsApp and SMS.' }
    ],
    status: 'live',
    isActive: true,
    postedBy: adminId
  };

  const existing = await Product.findOne({
    $or: [{ slug: 'gymproplus' }, { title: 'GymProPlus' }, { url: /gymproplus/i }]
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
  console.log('SUCCESS: GymProPlus product seeded!');
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
