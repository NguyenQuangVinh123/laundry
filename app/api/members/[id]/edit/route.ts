import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canManageMembers } from "@/lib/permissions";
import { getPackageConfig } from "@/lib/member-packages";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !canManageMembers(session.role)) {
    return NextResponse.json({ error: "Không có quyền." }, { status: 403 });
  }

  const body = await req.json();
  const { memberId, package: packageKey } = body;

  if (!memberId || !packageKey) {
    return NextResponse.json({ error: "Thiếu thông tin." }, { status: 400 });
  }

  const config = getPackageConfig(packageKey);
  if (!config) {
    return NextResponse.json({ error: "Gói không hợp lệ." }, { status: 400 });
  }

  // verify member exists
  const member = await prisma.memberAccount.findUnique({
    where: { id: Number(memberId) },
  });
  if (!member) {
    return NextResponse.json({ error: "Không tìm thấy thành viên." }, { status: 404 });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.validityDays);

  try {
    const account = await prisma.memberAccount.update({
      where: { id: Number(memberId) },
      data: {
        package: config.key,
        balance: config.bonus * 1000,
        expiresAt,
        transactions: {
          create: {
            amount: config.bonus * 1000,
            type: "DEPOSIT",
            note: `Chuyển sang ${config.label} — Nạp ${config.deposit}K, nhận ${config.bonus}K (tặng ${config.extra}K)`,
          },
        },
      },
    });
    return NextResponse.json({ success: true, balance: account.balance });
  } catch (e) {
    console.error("Edit member error:", e);
    return NextResponse.json({ error: "Cập nhật thất bại." }, { status: 500 });
  }
}
