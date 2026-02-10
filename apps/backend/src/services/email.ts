import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',  // Dev: Ethereal
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendShareEmail = async ({ to, subject, html }: {
  to: string; subject: string; html: string;
}) => {
  await transporter.sendMail({ to, subject, html });
};
