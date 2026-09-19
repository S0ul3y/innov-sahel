export const mailConfig = {
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT, 10) || 587,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASSWORD || '',
  },
  from: process.env.MAIL_FROM || '"InnovSahel" <noreply@innovsahel.org>',
  adminEmails: (process.env.ADMIN_NOTIFICATION_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean),
};
