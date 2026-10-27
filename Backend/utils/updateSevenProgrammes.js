import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Course from '../models/courseModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const updates = [
  {
    title: 'Anchoring & Stage Daring Masterclass',
    description: 'Master live public speaking, stage presence, microphone techniques, teleprompter handling, voice modulation, and audience engagement for corporate and media events.',
    category: 'Media & Communication',
    duration: '2 Months',
    startDate: '2026-11-05',
    level: 'beginner',
    mode: 'offline',
    price: 8999,
  },
  {
    title: 'Live Projects AI Automation Training',
    description: 'Build production-grade AI agents, workflow automations with n8n, Make, LangChain, API integrations, and custom autonomous LLM pipelines on real client briefs.',
    category: 'AI & Automation',
    duration: '3 Months',
    startDate: '2026-11-10',
    level: 'intermediate',
    mode: 'hybrid',
    price: 18999,
  },
  {
    title: 'Advance Social Media Automation Training',
    description: 'Implement automated social content syndication, AI copy generation, metric scrapers, scheduled multichannel publishing, and lead capture funnels.',
    category: 'Digital Marketing',
    duration: '2 Months',
    startDate: '2026-11-15',
    level: 'intermediate',
    mode: 'online',
    price: 12999,
  },
  {
    title: 'Advance Level Self Development Programme',
    description: 'High-impact cognitive reframing, emotional intelligence mastery, executive presence, stress resilience, habit architecture, and strategic goal execution.',
    category: 'Personal Growth',
    duration: '2 Months',
    startDate: '2026-11-20',
    level: 'beginner',
    mode: 'offline',
    price: 7999,
  },
  {
    title: 'Sales Marketing & Client Conversion Programme',
    description: 'Proven B2B high-ticket closing frameworks, consultative pitching, objection handling, CRM pipeline management, and client retention tactics.',
    category: 'Sales & Marketing',
    duration: '3 Months',
    startDate: '2026-11-25',
    level: 'intermediate',
    mode: 'hybrid',
    price: 14999,
  },
  {
    title: 'Business Growth & Leadership Excellence',
    description: 'Strategic scaling models, operational delegation, KPI dashboards, financial cash flow management, agile team leadership, and investor pitch preparation.',
    category: 'Business & Leadership',
    duration: '4 Months',
    startDate: '2026-12-01',
    level: 'advanced',
    mode: 'offline',
    price: 21999,
  },
  {
    title: 'IT Professionals Career Excellence',
    description: 'Accelerated tech career growth: architecture interview mastery, corporate navigation, cross-functional stakeholder communication, and tech leadership skills.',
    category: 'Career Development',
    duration: '3 Months',
    startDate: '2026-12-05',
    level: 'intermediate',
    mode: 'hybrid',
    price: 15999,
  },
];

async function run() {
  try {
    await connectDB();
    console.log('Connected to database.');

    let updatedCount = 0;

    for (const item of updates) {
      const course = await Course.findOne({
        title: { $regex: new RegExp(`^${item.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      });

      if (!course) {
        console.warn(`[NOT FOUND] Course with title "${item.title}" was not found.`);
        continue;
      }

      course.description = item.description;
      course.category = item.category;
      course.duration = item.duration;
      course.startDate = item.startDate;
      course.level = item.level;
      course.mode = item.mode;
      course.price = item.price;
      course.showPrice = true;
      course.isActive = true;

      await course.save();
      console.log(`[UPDATED] "${course.title}" -> ${course.category} | ${course.duration} | Starts ${course.startDate} | ₹${course.price.toLocaleString()}`);
      updatedCount++;
    }

    console.log(`\nSuccessfully updated ${updatedCount} courses with real-world content.`);
    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating courses:', error);
    process.exit(1);
  }
}

run();
