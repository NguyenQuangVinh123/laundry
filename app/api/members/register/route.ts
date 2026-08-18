import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canRegisterMember } from "@/lib/permissions";
import { getPackageConfig } from "@/lib/member-packages";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !canRegisterMember(session.role)) {
    return NextResponse.json({ error: "Không có quyền." }, { status: 403 });
  }

  const body = await req.json();
  const { customerId: rawCustomer, package: packageKey } = body;

  if (!rawCustomer || !packageKey) {
    return NextResponse.json({ error: "Thiếu thông tin." }, { status: 400 });
  }

  const config = getPackageConfig(packageKey);
  if (!config) {
    return NextResponse.json({ error: "Gói không hợp lệ." }, { status: 400 });
  }

  let customerId: number;
  const trimmed = String(rawCustomer).trim();
  const asId = Number(trimmed);
  if (!Number.isNaN(asId) && asId > 0) {
    const byId = await prisma.customer.findUnique({ where: { id: asId } });
    if (byId) {
      customerId = byId.id;
    } else {
      return NextResponse.json({ error: "Không tìm thấy khách hàng." }, { status: 404 });
    }
  } else {
    const byName = await prisma.customer.findFirst({
      where: { name: { equals: trimmed, mode: "insensitive" } },
    });
    if (byName) {
      customerId = byName.id;
    } else {
      const created = await prisma.customer.create({ data: { name: trimmed } });
      customerId = created.id;
    }
  }

  const existing = await prisma.memberAccount.findUnique({
    where: { customerId },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Khách đã có tài khoản thành viên." },
      { status: 409 },
    );
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.validityDays);

  try {
    const account = await prisma.memberAccount.create({
      data: {
        customerId,
        package: config.key,
        balance: config.bonus * 1000,
        expiresAt,
        transactions: {
          create: {
            amount: config.bonus * 1000,
            type: "DEPOSIT",
            note: `Đăng ký ${config.label} — Nạp ${config.deposit}K, nhận ${config.bonus}K (tặng ${config.extra}K)`,
          },
        },
      },
    });
    return NextResponse.json({ success: true, id: account.id });
  } catch (e) {
    console.error("Register member error:", e);
    return NextResponse.json({ error: "Đăng ký thất bại." }, { status: 500 });
  }
}
