import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canManageMembers } from "@/lib/permissions";

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || !canManageMembers(session.role)) {
    return NextResponse.json({ error: "Không có quyền." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");

  if (!memberId) {
    return NextResponse.json({ error: "Thiếu thông tin." }, { status: 400 });
  }

  const member = await prisma.memberAccount.findUnique({
    where: { id: Number(memberId) },
  });
  if (!member) {
    return NextResponse.json({ error: "Không tìm thấy thành viên." }, { status: 404 });
  }

  try {
    // Delete related transactions first
    await prisma.memberTransaction.deleteMany({
      where: { memberAccountId: Number(memberId) },
    });
    // Then delete the member account
    await prisma.memberAccount.delete({
      where: { id: Number(memberId) },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Delete member error:", e);
    return NextResponse.json({ error: "Xóa thất bại." }, { status: 500 });
  }
}
