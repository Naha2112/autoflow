import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET all automation workflows for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const automations = await prisma.automation.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        emailTemplate: {
          select: {
            id: true,
            name: true,
            subject: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(automations);
  } catch (error) {
    console.error("Error fetching automations:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST to create a new automation workflow
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, trigger, triggerData, emailTemplateId, active } = body;

    if (!name || !trigger) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if the email template exists and belongs to the user
    if (emailTemplateId) {
      const emailTemplate = await prisma.emailTemplate.findUnique({
        where: {
          id: emailTemplateId,
          userId: session.user.id,
        },
      });

      if (!emailTemplate) {
        return new NextResponse("Email template not found", { status: 404 });
      }
    }

    const automation = await prisma.automation.create({
      data: {
        name,
        trigger,
        triggerData: triggerData || {},
        emailTemplateId: emailTemplateId || null,
        active: active !== undefined ? active : true,
        userId: session.user.id,
      },
      include: {
        emailTemplate: {
          select: {
            id: true,
            name: true,
            subject: true,
          },
        },
      },
    });

    return NextResponse.json(automation);
  } catch (error) {
    console.error("Error creating automation:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 