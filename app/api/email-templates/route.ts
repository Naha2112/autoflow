import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET all email templates for the authenticated user
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Fetch the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Fetch all email templates for the current user
    const emailTemplates = await prisma.emailTemplate.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(emailTemplates);
  } catch (error) {
    console.error("[API_EMAIL_TEMPLATES_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create a new email template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, subject, body: templateBody } = body;

    if (!name || !subject || !templateBody) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const emailTemplate = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        body: templateBody,
        userId: session.user.id,
      },
    });

    return NextResponse.json(emailTemplate);
  } catch (error) {
    console.error("Error creating email template:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 