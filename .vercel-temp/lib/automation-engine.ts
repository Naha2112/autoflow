import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

interface InvoiceWithClient {
  id: string;
  invoiceNumber: string;
  client: {
    id: string;
    name: string;
    email: string;
  };
  status: string;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  tax: number;
  total: number;
}

class AutomationEngine {
  /**
   * Processes automations when a new invoice is created
   */
  async processInvoiceCreatedAutomation(invoiceId: string): Promise<void> {
    try {
      // Get the invoice with client details
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          client: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      if (!invoice) {
        console.error(`Invoice not found: ${invoiceId}`);
        return;
      }

      // If the invoice is sent, check for "INVOICE_SENT" automation
      if (invoice.status === "SENT") {
        await this.processAutomation("INVOICE_SENT", invoice);
      }
    } catch (error) {
      console.error("Error processing invoice created automation:", error);
    }
  }

  /**
   * Processes automations for overdue invoices
   */
  async processOverdueInvoices(): Promise<void> {
    try {
      // Find invoices that are due today or past due
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const overdueInvoices = await prisma.invoice.findMany({
        where: {
          status: "SENT",
          dueDate: {
            lt: today
          }
        },
        include: {
          client: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      if (overdueInvoices.length === 0) {
        console.log("No overdue invoices found.");
        return;
      }

      console.log(`Processing ${overdueInvoices.length} overdue invoices...`);

      // Update status to OVERDUE and trigger automations
      for (const invoice of overdueInvoices) {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: "OVERDUE" }
        });

        await this.processAutomation("INVOICE_OVERDUE", invoice);
      }
    } catch (error) {
      console.error("Error processing overdue invoices:", error);
    }
  }

  /**
   * Processes a specific automation by type
   */
  private async processAutomation(
    triggerType: string,
    invoice: any
  ): Promise<void> {
    try {
      // Find automation for the trigger type and user
      const automation = await prisma.automation.findFirst({
        where: {
          trigger: triggerType,
          userId: invoice.userId
        },
        include: {
          emailTemplate: true
        }
      });

      if (!automation || !automation.emailTemplate) {
        console.log(`No automation found for trigger: ${triggerType}`);
        return;
      }

      // Process the email based on the template
      const emailTemplate = automation.emailTemplate;
      const processedSubject = this.replaceVariables(emailTemplate.subject, invoice);
      const processedBody = this.replaceVariables(emailTemplate.body, invoice);

      // Send the email
      await sendEmail({
        to: invoice.client.email,
        subject: processedSubject,
        html: processedBody,
        from: invoice.user.email
      });

      console.log(`Sent ${triggerType} email for invoice ${invoice.invoiceNumber} to ${invoice.client.email}`);
    } catch (error) {
      console.error(`Error processing ${triggerType} automation:`, error);
    }
  }

  /**
   * Replaces template variables with actual values
   */
  private replaceVariables(template: string, invoice: any): string {
    const variables: Record<string, string> = {
      "{{invoiceNumber}}": invoice.invoiceNumber,
      "{{clientName}}": invoice.client.name,
      "{{total}}": invoice.total.toFixed(2),
      "{{dueDate}}": new Date(invoice.dueDate).toLocaleDateString(),
      "{{issueDate}}": new Date(invoice.issueDate).toLocaleDateString(),
      "{{businessName}}": invoice.user.name || "Our Business"
    };

    let processedTemplate = template;
    for (const [key, value] of Object.entries(variables)) {
      processedTemplate = processedTemplate.replace(
        new RegExp(key, "g"),
        value
      );
    }

    return processedTemplate;
  }
}

export const automationEngine = new AutomationEngine(); 