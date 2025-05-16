import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { automationEngine } from "@/lib/automation-engine";

// GET all invoices for the authenticated user
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
    
    // Fetch all invoices for the current user
    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      include: {
        client: {
          select: {
            name: true,
            email: true
          }
        },
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // For testing purposes, if no invoices, return empty array
    if (!invoices.length) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(invoices);
  } catch (error) {
    console.error("[API_INVOICES_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create a new invoice
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { clientId, invoiceNumber, issueDate, dueDate, items, notes, status } = body;

    if (!clientId || !invoiceNumber || !dueDate || !items || items.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Calculate subtotal and total
    const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
    const tax = body.tax || 0;
    const total = subtotal + tax;

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId,
        userId: session.user.id,
        status: status || "DRAFT",
        issueDate: new Date(issueDate || new Date()),
        dueDate: new Date(dueDate),
        subtotal,
        tax,
        total,
        notes,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
          })),
        },
      },
      include: {
        items: true,
        client: true,
      },
    });

    // Trigger automation if invoice is not in DRAFT status
    if (invoice.status !== "DRAFT") {
      // Process in the background
      setTimeout(() => {
        automationEngine.processInvoiceCreatedAutomation(invoice.id);
      }, 100);
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 