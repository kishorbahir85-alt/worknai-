import asyncHandler from 'express-async-handler';
import { sendMail } from '../utils/mailer.js';

// In-memory OTP store: email -> { otp, expiry }
const otpStore = new Map();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) { res.status(400); throw new Error('Email is required'); }

  const otp = generateOtp();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(email.toLowerCase(), { otp, expiry });

  try {
    await sendMail({
      to: email,
      subject: 'WorknAi — Your OTP for Business  Enquiry',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;background:#0d0d1a;color:#fff;border-radius:12px;">
          <h2 style="color:#9a6bff;margin-bottom:8px;">WorknAi Technologies</h2>
          <p style="color:#a89cc8;margin-bottom:24px;">Your OTP for Business  Enquiry verification:</p>
          <div style="background:#1a0b3d;border:1px solid #3d1a8c;border-radius:10px;padding:24px;text-align:center;margin-bottom:24px;">
            <span style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#fff;">${otp}</span>
          </div>
          <p style="color:#a89cc8;font-size:13px;">This OTP is valid for <strong style="color:#fff;">10 minutes</strong>. Do not share it with anyone.</p>
          <p style="color:#6b5d8f;font-size:12px;margin-top:16px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
  } catch (err) {
    otpStore.delete(email.toLowerCase());
    console.error('OTP email send failed:', err.message);
    res.status(502);
    throw new Error('Unable to send the OTP email right now. Please try again later or contact us directly.');
  }

  res.json({ message: 'OTP sent successfully' });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) { res.status(400); throw new Error('Email and OTP are required'); }

  const record = otpStore.get(email.toLowerCase());
  if (!record) { res.status(400); throw new Error('OTP not found. Please request a new one.'); }
  if (Date.now() > record.expiry) {
    otpStore.delete(email.toLowerCase());
    res.status(400); throw new Error('OTP has expired. Please request a new one.');
  }
  if (record.otp !== otp.toString()) {
    res.status(400); throw new Error('Invalid OTP. Please try again.');
  }

  otpStore.delete(email.toLowerCase());
  res.json({ message: 'OTP verified successfully' });
});
