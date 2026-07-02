import nodemailer from 'nodemailer';

export const sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      // Gmail app passwords are often pasted as "xxxx xxxx xxxx xxxx"; spaces are not part of the password.
      pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''),
    },
  });

  await transporter.sendMail({
    from: `"WorknAi" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
