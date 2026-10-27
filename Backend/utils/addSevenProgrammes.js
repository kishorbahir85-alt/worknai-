import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import { slugify } from './slugify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const programmes = [
  'Anchoring & Stage Daring Masterclass',
  'Live Projects AI Automation Training',
  'Advance Social Media Automation Training',
  'Advance Level Self Development Programme',
  'Sales Marketing & Client Conversion Programme',
  'Business Growth & Leadership Excellence',
  'IT Professionals Career Excellence',
];

const uniqueSlug = async (title) => {
  let base = slugify(title);
  let slug = base;
  let i = 1;
  while (await Course.exists({ slug })) {
    slug = `${base}-${i++}`;
  }
  return slug;
};

async function run() {
  try {
    await connectDB();
    console.log('Connected to database.');

    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.findOne();
    }
    if (!admin) {
      console.error('No user found to associate postedBy.');
      process.exit(1);
    }
    console.log(`Using admin user: ${admin.name} (${admin._id}) for postedBy.`);

    const added = [];
    const skipped = [];

    for (const title of programmes) {
      const existing = await Course.findOne({
        title: { $regex: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      });

      if (existing) {
        console.log(`[SKIP] Course already exists: "${existing.title}" (slug: ${existing.slug})`);
        skipped.push(existing);
      } else {
        const slug = await uniqueSlug(title);
        const newCourse = await Course.create({
          title,
          slug,
          description: '',
          shortDescription: '',
          icon: '📚',
          category: '',
          duration: '',
          startDate: '',
          price: 0,
          discountPrice: 0,
          showPrice: true,
          level: 'beginner',
          mode: 'offline',
          isActive: true,
          featured: false,
          batches: [],
          postedBy: admin._id,
        });
        console.log(`[CREATED] Course added: "${newCourse.title}" (slug: ${newCourse.slug})`);
        added.push(newCourse);
      }
    }

    console.log(`\nSummary: ${added.length} created, ${skipped.length} already existed.`);
    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('Error adding programmes:', error);
    process.exit(1);
  }
}

run();
