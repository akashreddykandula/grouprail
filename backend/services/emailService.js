import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"GroupRail" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#0f172a;font-family:Inter,sans-serif;">
      <div style="max-width:520px;margin:40px auto;padding:40px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;background:#4f46e5;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
            <span style="color:white;font-size:24px;">🚂</span>
          </div>
          <h1 style="color:#f1f5f9;font-size:24px;font-weight:700;margin:0;">GroupRail</h1>
        </div>

        <h2 style="color:#f1f5f9;font-size:20px;font-weight:600;margin:0 0 8px;">Reset your password</h2>
        <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Hi ${name}, we received a request to reset your GroupRail password. Click the button below to create a new one.
        </p>

        <a href="${resetUrl}"
           style="display:block;background:#4f46e5;color:#fff;text-decoration:none;text-align:center;padding:14px 24px;border-radius:12px;font-size:15px;font-weight:600;margin-bottom:24px;">
          Reset Password
        </a>

        <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 8px;">
          This link expires in <strong style="color:#94a3b8;">1 hour</strong>. If you didn't request this, you can safely ignore this email.
        </p>

        <p style="color:#475569;font-size:12px;margin:24px 0 0;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1);">
          Or copy this URL: <a href="${resetUrl}" style="color:#818cf8;word-break:break-all;">${resetUrl}</a>
        </p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Reset your GroupRail password',
    html,
  });
};

export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0f172a;font-family:Inter,sans-serif;">
      <div style="max-width:520px;margin:40px auto;padding:40px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;">
        <h2 style="color:#f1f5f9;font-size:22px;font-weight:700;margin:0 0 12px;">Welcome to GroupRail, ${name}! 🎉</h2>
        <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 20px;">
          You're all set to start planning group train journeys. Create a trip, invite your friends, and let our AI help you travel together.
        </p>
        <a href="${process.env.CLIENT_URL}/dashboard"
           style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:12px;font-size:15px;font-weight:600;">
          Go to Dashboard
        </a>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to GroupRail 🚂',
    html,
  });
};
