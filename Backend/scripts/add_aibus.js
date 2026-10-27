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
    title: 'AIBus',
    slug: 'aibus',
    tagline: 'Modern AI-Powered Bus Booking & Smart Fleet Mobility Platform.',
    description: 'AIBus is a next-generation smart bus booking and fleet telematics platform offering real-time GPS bus tracking, interactive seat layout booking, dynamic route dispatch, and seamless QR-based digital ticketing for travelers and fleet operators.',
    category: 'Travel & Bus Booking',
    url: 'https://www.aibus.in/',
    logoUrl: '/logos/aibus_logo.png',
    heroImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&h=1000&fit=crop&q=80',
    overviewImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&auto=format&fit=crop&q=80',
    benefitsImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80'
    ],
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS', 'GPS Telematics', 'REST API'],
    features: [
      'Real-Time GPS Bus Telematics & Live ETA',
      'Smart Seat Layout & Interactive Berth Selection',
      'Instant Digital QR Tickets & WhatsApp Confirmation',
      'AI Route Optimization & Fleet Dispatch',
      'Automated Delay & Arrival Notifications',
      'Secure Multi-Option Payment Gateway Integration'
    ],
    benefits: [
      'Zero-hassle instant bus reservation',
      'Live bus location tracking reduces waiting time',
      'Optimized seat pricing and fleet load factor',
      '24/7 passenger support with instant cancellations'
    ],
    howItWorks: [
      { title: 'Search Routes', description: 'Enter pickup and drop locations with travel date to view available coaches and live fares.' },
      { title: 'Select Seats', description: 'View real-time berth layouts (sleeper / seater / AC) and select your preferred seats.' },
      { title: 'Instant Confirmation', description: 'Pay securely and receive your digital ticket with boarding point navigation.' }
    ],
    faqs: [
      { question: 'How can I track my bus on AIBus?', answer: 'Once booked, you receive a live tracking link via SMS/WhatsApp with real-time GPS updates.' },
      { question: 'What cancellation options are available?', answer: 'Instant 1-click cancellation is supported directly through the portal with fast refund processing.' }
    ],
    status: 'live',
    isActive: true,
    postedBy: adminId
  };

  const existing = await Product.findOne({
    $or: [{ slug: 'aibus' }, { title: 'AIBus' }, { url: 'https://www.aibus.in/' }]
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
  console.log('SUCCESS: AIBus product seeded!');
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
