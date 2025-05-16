import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET a single automation workflow by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const automation = await prisma.automation.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        emailTemplate: true,
      },
    });

    if (!automation) {
      return new NextResponse("Automation not found", { status: 404 });
    }

    return NextResponse.json(automation);
  } catch (error) {
    console.error("Error fetching automation:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH to update an automation workflow
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, trigger, triggerData, emailTemplateId, active } = body;

    const automation = await prisma.automation.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!automation) {
      return new NextResponse("Automation not found", { status: 404 });
    }

    // If emailTemplateId is provided, check if it exists and belongs to the user
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

    const updatedAutomation = await prisma.automation.update({
      where: {
        id: params.id,
      },
      data: {
        name: name || undefined,
        trigger: trigger || undefined,
        triggerData: triggerData !== undefined ? triggerData : undefined,
        emailTemplateId: emailTemplateId !== undefined ? emailTemplateId : undefined,
        active: active !== undefined ? active : undefined,
      },
      include: {
        emailTemplate: true,
      },
    });

    return NextResponse.json(updatedAutomation);
  } catch (error) {
    console.error("Error updating automation:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE an automation workflow
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const automation = await prisma.automation.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!automation) {
      return new NextResponse("Automation not found", { status: 404 });
    }

    await prisma.automation.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting automation:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 