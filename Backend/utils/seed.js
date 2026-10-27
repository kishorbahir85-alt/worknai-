import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/userModel.js';

dotenv.config();

// Read seed credentials from environment variables.
// Set these in Backend/.env before running:
//   SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD
//   SEED_MANAGER_EMAIL, SEED_MANAGER_PASSWORD
//   SEED_HR_EMAIL, SEED_HR_PASSWORD
const users = [
  {
    name: 'Admin',
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
    role: 'admin',
  },
  {
    name: 'Manager',
    email: process.env.SEED_MANAGER_EMAIL,
    password: process.env.SEED_MANAGER_PASSWORD,
    role: 'manager',
  },
  {
    name: 'HR',
    email: process.env.SEED_HR_EMAIL,
    password: process.env.SEED_HR_PASSWORD,
    role: 'hr',
  },
];

const seedUsers = async () => {
  // Validate required env vars before touching the database
  const missing = users.filter((u) => !u.email || !u.password).map((u) => u.role);
  if (missing.length) {
    console.error(`❌ Seed aborted: missing env vars for roles: ${missing.join(', ')}`);
    console.error('   Set SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_MANAGER_EMAIL,');
    console.error('   SEED_MANAGER_PASSWORD, SEED_HR_EMAIL, SEED_HR_PASSWORD in Backend/.env');
    process.exit(1);
  }

  try {
    await connectDB();

    for (const u of users) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log(`⏭  Skipped (already exists): ${u.email} (${u.role})`);
        continue;
      }

      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({
        name: u.name,
        email: u.email,
        password: hashed,
        role: u.role,
      });
      console.log(`✅ Seeded: ${u.email} (${u.role})`);
    }

    console.log('\n🎉 Seed complete. Existing users were not modified.');
    process.exit();
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedUsers();