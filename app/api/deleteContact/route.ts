import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canManageBills } from "@/lib/permissions";
import { refundMemberBalanceForBill } from "@/lib/member-actions";

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || !canManageBills(session.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "Bill ID is required" }, { status: 400 });
    }

    const billId = Number(id);
    await refundMemberBalanceForBill(billId);
    await prisma.bill.delete({
      where: { id: billId },
    });
    return NextResponse.json({ message: "Okay" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ message: "Failed to delete contact" }, { status: 500 });
  }
}
