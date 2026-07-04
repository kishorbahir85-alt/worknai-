import nodemailer from 'nodemailer';

// Uses the SMTP_HOST relay when set (e.g. Brevo, Resend); falls back to Gmail.
export const sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(
    process.env.SMTP_HOST
      ? {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        }
      : {
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            // Gmail app passwords are often pasted as "xxxx xxxx xxxx xxxx"; spaces are not part of the password.
            pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''),
          },
        }
  );

  await transporter.sendMail({
    // Relay logins are often not valid sender addresses; SMTP_FROM overrides.
    from: `"WorknAi" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
