import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (!mongoUri) {
    console.error('Error: MONGO_URI is not set. Add it to Backend/.env before starting the backend.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
