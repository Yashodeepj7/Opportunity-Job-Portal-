import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD, // must be Google App Password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"Opportunity" <${process.env.SMTP_MAIL}>`,
      to,
      subject,
      html,
    });

    console.log("📩 Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.log("❌ Email sending failed:", error.message);
    return false;
  }
};
