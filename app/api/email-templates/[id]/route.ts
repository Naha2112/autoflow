import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET a single email template by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const emailTemplate = await prisma.emailTemplate.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!emailTemplate) {
      return new NextResponse("Email template not found", { status: 404 });
    }

    return NextResponse.json(emailTemplate);
  } catch (error) {
    console.error("Error fetching email template:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH to update an email template
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
    const { name, subject, body: templateBody } = body;

    const emailTemplate = await prisma.emailTemplate.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!emailTemplate) {
      return new NextResponse("Email template not found", { status: 404 });
    }

    const updatedEmailTemplate = await prisma.emailTemplate.update({
      where: {
        id: params.id,
      },
      data: {
        name: name || undefined,
        subject: subject || undefined,
        body: templateBody || undefined,
      },
    });

    return NextResponse.json(updatedEmailTemplate);
  } catch (error) {
    console.error("Error updating email template:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE an email template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const emailTemplate = await prisma.emailTemplate.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!emailTemplate) {
      return new NextResponse("Email template not found", { status: 404 });
    }

    await prisma.emailTemplate.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting email template:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 