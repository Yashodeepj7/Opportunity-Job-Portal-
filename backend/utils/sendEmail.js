
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Opportunity" <${process.env.SMTP_MAIL}>`,
      to,
      subject,
      html,
    });

    console.log("📩 Email sent successfully");
  } catch (error) {
    console.log("❌ Email sending failed:", error.message);
  }
};
