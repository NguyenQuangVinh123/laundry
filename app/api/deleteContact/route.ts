import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "Bill ID is required" }, { status: 400 });
    }

    // Delete bills associated with the customer
    await prisma.bill.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Okay" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ message: "Failed to delete contact" }, { status: 500 });
  }
}