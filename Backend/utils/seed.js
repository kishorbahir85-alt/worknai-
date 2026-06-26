import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/userModel.js';

dotenv.config();

const users = [
  { name: 'Admin',   email: 'surajkurrey956@gmail.com', password: 'Suraj@2001',  role: 'admin' },
  { name: 'Manager', email: 'manager@worknai.com',       password: 'Manager@123', role: 'manager' },
  { name: 'HR',      email: 'hr@worknai.com',            password: 'Hr@123456',   role: 'hr' },
];

const seedUsers = async () => {
  try {
    await connectDB();

    for (const u of users) {
      await User.deleteOne({ email: u.email }); // purana nikalo

      const hashed = await bcrypt.hash(u.password, 10); // ✅ manually hash karo

      await User.create({
        name: u.name,
        email: u.email,
        password: hashed, // hashed password save karo
        role: u.role,
      });

      console.log(`✅ Seeded: ${u.email} (${u.role})`);
    }

    console.log('\n🎉 All users seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedUsers();