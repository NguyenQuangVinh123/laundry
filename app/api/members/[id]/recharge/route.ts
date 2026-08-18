import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canManageMembers } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !canManageMembers(session.role)) {
    return NextResponse.json({ error: "Không có quyền." }, { status: 403 });
  }

  const body = await req.json();
  const { memberId, amount } = body;

  if (!memberId || !amount || Number(amount) <= 0) {
    return NextResponse.json({ error: "Số tiền không hợp lệ." }, { status: 400 });
  }

  const member = await prisma.memberAccount.findUnique({
    where: { id: Number(memberId) },
  });
  if (!member) {
    return NextResponse.json({ error: "Không tìm thấy thành viên." }, { status: 404 });
  }

  try {
    const account = await prisma.memberAccount.update({
      where: { id: Number(memberId) },
      data: {
        balance: { increment: Number(amount) * 1000 },
        transactions: {
          create: {
            amount: Number(amount) * 1000,
            type: "RECHARGE",
            note: `Nạp thêm ${amount}K`,
          },
        },
      },
    });
    return NextResponse.json({ success: true, balance: account.balance });
  } catch (e) {
    console.error("Recharge error:", e);
    return NextResponse.json({ error: "Nạp thất bại." }, { status: 500 });
  }
}
