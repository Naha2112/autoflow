import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET a single client by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!client) {
      return new NextResponse("Client not found", { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH to update a client
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
    const { name, email, phone, address } = body;

    const client = await prisma.client.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!client) {
      return new NextResponse("Client not found", { status: 404 });
    }

    const updatedClient = await prisma.client.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE a client
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!client) {
      return new NextResponse("Client not found", { status: 404 });
    }

    await prisma.client.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting client:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 