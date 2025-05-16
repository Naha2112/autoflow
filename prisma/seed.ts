import { PrismaClient } from "../lib/generated/prisma";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const testUserEmail = "test@example.com";
  
  // Check if test user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: testUserEmail,
    },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("password123", 12);
    
    const user = await prisma.user.create({
      data: {
        email: testUserEmail,
        name: "Test User",
        hashedPassword,
      },
    });
    
    console.log(`Created test user: ${user.email}`);
    
    // Create a sample client
    const client = await prisma.client.create({
      data: {
        name: "Acme Inc",
        email: "contact@acme.com",
        phone: "555-123-4567",
        address: "123 Main St, Anytown, USA",
        userId: user.id,
      },
    });
    
    console.log(`Created sample client: ${client.name}`);
    
    // Create a sample email template
    const emailTemplate = await prisma.emailTemplate.create({
      data: {
        name: "Invoice Payment Reminder",
        subject: "Payment Reminder for Invoice {{invoiceNumber}}",
        body: "<p>Dear {{clientName}},</p>\n<p>This is a friendly reminder that invoice #{{invoiceNumber}} for ${{total}} is due on {{dueDate}}.</p>\n<p>Thank you for your business!</p>\n<p>Sincerely,<br>{{businessName}}</p>",
        userId: user.id,
      },
    });
    
    console.log(`Created sample email template: ${emailTemplate.name}`);
    
    // Create a sample automation
    const automation = await prisma.automation.create({
      data: {
        name: "Invoice Overdue Reminder",
        trigger: "INVOICE_OVERDUE",
        emailTemplateId: emailTemplate.id,
        userId: user.id,
      },
    });
    
    console.log(`Created sample automation: ${automation.name}`);
  } else {
    console.log(`Test user already exists: ${testUserEmail}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 