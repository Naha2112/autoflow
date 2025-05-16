import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

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
    
    // Fetch all automations for the current user
    const automations = await prisma.automation.findMany({
      where: { userId: user.id },
      include: {
        emailTemplate: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(automations);
  } catch (error) {
    console.error("[API_AUTOMATIONS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
    
    // Parse request body
    const body = await request.json();
    const { name, trigger, emailTemplateId } = body;
    
    // Validate required fields
    if (!name || !trigger) {
      return NextResponse.json(
        { error: "Name and trigger are required" },
        { status: 400 }
      );
    }
    
    // Create new automation
    const automation = await prisma.automation.create({
      data: {
        name,
        trigger,
        emailTemplateId: emailTemplateId || null,
        active: true,
        userId: user.id
      },
      include: {
        emailTemplate: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    return NextResponse.json(automation, { status: 201 });
  } catch (error) {
    console.error("[API_AUTOMATIONS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 