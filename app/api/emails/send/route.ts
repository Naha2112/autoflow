import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { to, templateId, variables, subject, html } = body;

    if (!to) {
      return new NextResponse("Recipient email is required", { status: 400 });
    }

    // Check if using template or direct content
    if (templateId) {
      // Verify template belongs to user
      const template = await prisma.emailTemplate.findUnique({
        where: {
          id: templateId,
          userId: session.user.id,
        },
      });

      if (!template) {
        return new NextResponse("Email template not found", { status: 404 });
      }

      // Send email with template
      const result = await emailService.sendTemplateEmail(to, templateId, variables || {});
      
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        previewUrl: process.env.NODE_ENV === "development" ? result.response : undefined,
      });
    } else if (subject && html) {
      // Send direct email without template
      const result = await emailService.sendEmail({
        to,
        subject,
        html,
        variables,
      });

      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        previewUrl: process.env.NODE_ENV === "development" ? result.response : undefined,
      });
    } else {
      return new NextResponse("Either templateId or subject and html content are required", {
        status: 400,
      });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 