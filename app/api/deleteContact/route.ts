// app/api/deleteContact/route.ts
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json({ message: "Customer ID is required" }, { status: 400 });
    }

    // Delete bills associated with the customer
    await prisma.bill.deleteMany({
      where: { customerId: Number(customerId) },
    });

    // Delete the customer
    await prisma.customer.delete({
      where: { id: Number(customerId) },
    });

    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ message: "Failed to delete contact" }, { status: 500 });
  }
}