import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { automationEngine } from "@/lib/automation-engine";

// GET a single invoice by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        client: true,
        items: true,
      },
    });

    if (!invoice) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH to update an invoice
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
    const { clientId, invoiceNumber, issueDate, dueDate, items, notes, status, tax } = body;

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    });

    if (!invoice) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    // Store the old status for automation check
    const oldStatus = invoice.status;

    // Calculate new subtotal and total if items have changed
    let subtotal = invoice.subtotal;
    let total = invoice.total;
    let updatedTax = tax !== undefined ? tax : invoice.tax;

    if (items) {
      subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
      total = subtotal + updatedTax;

      // Delete existing items and create new ones
      await prisma.invoiceItem.deleteMany({
        where: {
          invoiceId: params.id,
        },
      });

      // Create new items
      await Promise.all(
        items.map((item: any) =>
          prisma.invoiceItem.create({
            data: {
              invoiceId: params.id,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              amount: item.amount,
            },
          })
        )
      );
    }

    // Update invoice
    const updatedInvoice = await prisma.invoice.update({
      where: {
        id: params.id,
      },
      data: {
        clientId: clientId || undefined,
        invoiceNumber: invoiceNumber || undefined,
        status: status || undefined,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        subtotal,
        tax: updatedTax,
        total,
        notes: notes !== undefined ? notes : undefined,
      },
      include: {
        client: true,
        items: true,
      },
    });

    // Check if status has changed and trigger automation
    if (status && status !== oldStatus) {
      // Process in the background
      setTimeout(() => {
        automationEngine.processInvoiceStatusAutomation(params.id, status);
      }, 100);
    }

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE an invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!invoice) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    // Delete the invoice (invoice items will be cascaded due to our schema definition)
    await prisma.invoice.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 