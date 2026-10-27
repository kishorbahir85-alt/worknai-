import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  sendCount: {
    type: Number,
    default: 1,
  },
  windowStart: {
    type: Date,
    default: Date.now,
  },
  // TTL: MongoDB auto-deletes documents 10 minutes after createdAt
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 10 minutes in seconds
  },
});

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
