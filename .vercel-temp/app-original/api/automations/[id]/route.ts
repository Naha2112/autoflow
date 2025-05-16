import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    // Fetch the automation
    const automation = await prisma.automation.findUnique({
      where: { 
        id: params.id,
        userId: user.id // Ensure the automation belongs to the user
      },
      include: {
        emailTemplate: {
          select: {
            id: true,
            name: true,
            subject: true
          }
        }
      }
    });
    
    if (!automation) {
      return NextResponse.json({ error: "Automation not found" }, { status: 404 });
    }
    
    return NextResponse.json(automation);
  } catch (error) {
    console.error("[API_AUTOMATION_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    // Check if automation exists and belongs to user
    const existingAutomation = await prisma.automation.findUnique({
      where: { 
        id: params.id,
        userId: user.id
      }
    });
    
    if (!existingAutomation) {
      return NextResponse.json({ error: "Automation not found" }, { status: 404 });
    }
    
    // Update automation
    const updatedAutomation = await prisma.automation.update({
      where: { id: params.id },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        trigger: body.trigger !== undefined ? body.trigger : undefined,
        emailTemplateId: body.emailTemplateId !== undefined ? body.emailTemplateId : undefined,
        active: body.active !== undefined ? body.active : undefined
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
    
    return NextResponse.json(updatedAutomation);
  } catch (error) {
    console.error("[API_AUTOMATION_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    // Check if automation exists and belongs to user
    const existingAutomation = await prisma.automation.findUnique({
      where: { 
        id: params.id,
        userId: user.id
      }
    });
    
    if (!existingAutomation) {
      return NextResponse.json({ error: "Automation not found" }, { status: 404 });
    }
    
    // Delete automation
    await prisma.automation.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API_AUTOMATION_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 