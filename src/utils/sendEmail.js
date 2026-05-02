import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: `"Support Team" <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,   // fallback plain text
    html: options.html       // 🔥 HTML template
  };

  await transporter.sendMail(mailOptions);
};
