import nodemailer from "nodemailer";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    // Create a test account for development
    let testAccount;
    let transporter;
    
    if (process.env.NODE_ENV === "production" && process.env.EMAIL_SERVER_HOST) {
      // Production email configuration
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        secure: process.env.EMAIL_SERVER_PORT === "465",
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });
    } else {
      // Development email configuration using ethereal.email
      testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    // Send the email
    const from = options.from || process.env.EMAIL_FROM || "noreply@autoflow.app";
    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>/g, ""), // Strip HTML tags for plain text
      html: options.html,
    });

    // For development, log the test URL
    if (testAccount) {
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
} 