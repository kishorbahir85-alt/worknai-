import asyncHandler from 'express-async-handler';
import { sendMail } from '../utils/mailer.js';
import OTP from '../models/otpModel.js';

const MAX_SEND_PER_WINDOW = 3;   // max OTP sends per email per 10-min window
const MAX_VERIFY_ATTEMPTS = 5;   // max wrong guesses before OTP is invalidated
const SEND_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) { res.status(400); throw new Error('Email is required'); }

  const normalEmail = email.toLowerCase().trim();
  const now = Date.now();

  // Rate limiting: max MAX_SEND_PER_WINDOW sends per 10-min window
  const existing = await OTP.findOne({ email: normalEmail });
  if (existing) {
    const windowAge = now - existing.windowStart.getTime();
    if (windowAge < SEND_WINDOW_MS && existing.sendCount >= MAX_SEND_PER_WINDOW) {
      res.status(429);
      throw new Error('Too many OTP requests. Please wait a few minutes before trying again.');
    }
  }

  const otp = generateOtp();

  // Upsert: replace any existing OTP record for this email
  await OTP.findOneAndReplace(
    { email: normalEmail },
    {
      email: normalEmail,
      otp,
      attempts: 0,
      sendCount: existing && (now - existing.windowStart.getTime()) < SEND_WINDOW_MS
        ? existing.sendCount + 1
        : 1,
      windowStart: existing && (now - existing.windowStart.getTime()) < SEND_WINDOW_MS
        ? existing.windowStart
        : new Date(now),
      createdAt: new Date(now),
    },
    { upsert: true, new: true }
  );

  try {
    await sendMail({
      to: email,
      subject: 'WorknAi — Your OTP for Business Inquiry',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;background:#0d0d1a;color:#fff;border-radius:12px;">
          <h2 style="color:#9a6bff;margin-bottom:8px;">Worknai Technologies</h2>
          <p style="color:#a89cc8;margin-bottom:24px;">Your OTP for Business Inquiry verification:</p>
          <div style="background:#1a0b3d;border:1px solid #3d1a8c;border-radius:10px;padding:24px;text-align:center;margin-bottom:24px;">
            <span style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#fff;">${otp}</span>
          </div>
          <p style="color:#a89cc8;font-size:13px;">This OTP is valid for <strong style="color:#fff;">10 minutes</strong>. Do not share it with anyone.</p>
          <p style="color:#6b5d8f;font-size:12px;margin-top:16px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
  } catch (err) {
    // Remove the OTP record if email fails so the user can retry
    await OTP.deleteOne({ email: normalEmail });
    console.error('OTP email send failed:', err.message);
    res.status(502);
    throw new Error('Unable to send the OTP email right now. Please try again later or contact us directly.');
  }

  res.json({ message: 'OTP sent successfully' });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) { res.status(400); throw new Error('Email and OTP are required'); }

  const normalEmail = email.toLowerCase().trim();
  const record = await OTP.findOne({ email: normalEmail });

  if (!record) {
    res.status(400);
    throw new Error('OTP not found. Please request a new one.');
  }

  // Brute-force protection: too many failed attempts
  if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
    await OTP.deleteOne({ email: normalEmail });
    res.status(400);
    throw new Error('Too many failed attempts. Please request a new OTP.');
  }

  // Wrong OTP: increment attempts
  if (record.otp !== otp.toString()) {
    await OTP.updateOne({ email: normalEmail }, { $inc: { attempts: 1 } });
    const remaining = MAX_VERIFY_ATTEMPTS - (record.attempts + 1);
    res.status(400);
    throw new Error(`Invalid OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
  }

  // Correct OTP — delete it (single-use)
  await OTP.deleteOne({ email: normalEmail });
  res.json({ message: 'OTP verified successfully' });
});
