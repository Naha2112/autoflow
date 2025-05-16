import nodemailer from "nodemailer";
import { prisma } from "./prisma";

// For development, we'll use a test account
// In production, use real SMTP credentials
let transporter: nodemailer.Transporter;

async function createTransporter() {
  if (!process.env.EMAIL_SERVER_HOST) {
    // Create test account for development
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    console.log("Using test email account:", testAccount.user);
    return;
  }
  
  // Use real SMTP credentials in production
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT || 587),
    secure: process.env.EMAIL_SERVER_PORT === "465",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
}

// Initialize the transporter
createTransporter();

// Replace template variables with actual values
function processTemplate(content: string, variables: Record<string, any>) {
  return content.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
    const variableName = variable.trim();
    return variables[variableName] !== undefined ? variables[variableName] : match;
  });
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  templateId?: string;
  variables?: Record<string, any>;
}

export const emailService = {
  /**
   * Send an email
   */
  async sendEmail({
    to,
    subject,
    text,
    html,
    from = process.env.EMAIL_FROM || 'noreply@autoflow.com',
    templateId,
    variables,
  }: SendEmailOptions) {
    // Ensure transporter is created
    if (!transporter) {
      await createTransporter();
    }
    
    // If templateId is provided, fetch the template
    if (templateId && !html) {
      const template = await prisma.emailTemplate.findUnique({
        where: { id: templateId },
      });
      
      if (!template) {
        throw new Error(`Email template with ID ${templateId} not found`);
      }
      
      // Process the template with variables
      const processedSubject = variables
        ? processTemplate(template.subject, variables)
        : template.subject;
        
      const processedBody = variables
        ? processTemplate(template.body, variables)
        : template.body;
        
      subject = processedSubject;
      html = processedBody;
    }
    
    // Send the email
    const result = await transporter.sendMail({
      from,
      to: Array.isArray(to) ? to.join(',') : to,
      subject,
      text: text || html?.replace(/<[^>]*>/g, ''), // Strip HTML if no text is provided
      html: html,
    });
    
    if (process.env.NODE_ENV === 'development') {
      // Log the preview URL in development
      console.log('Email preview URL:', nodemailer.getTestMessageUrl(result));
    }
    
    return result;
  },
  
  /**
   * Send an email using a template ID and variables
   */
  async sendTemplateEmail(to: string | string[], templateId: string, variables: Record<string, any>, from?: string) {
    return this.sendEmail({
      to,
      from,
      templateId,
      variables,
      subject: '', // This will be overwritten by the template
    });
  },
}; 