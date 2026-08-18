"use server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getPackageConfig } from "@/lib/member-packages";

/**
 * Tạo tài khoản thành viên cho khách hàng.
 * Dùng khi khách đăng ký gói mới lần đầu.
 */
export const createMemberAccount = async (
  _prev: any,
  formData: FormData,
) => {
  await requireRole(["ADMIN", "SUPERVISOR"]);

  const customerId = Number(formData.get("customerId"));
  const packageKey = formData.get("package")?.toString();

  if (!customerId || !packageKey) {
    return { error: "Thiếu thông tin khách hàng hoặc gói." };
  }

  const config = getPackageConfig(packageKey);
  if (!config) {
    return { error: "Gói thành viên không hợp lệ." };
  }

  // check if already has an account
  const existing = await prisma.memberAccount.findUnique({
    where: { customerId },
  });
  if (existing) {
    return { error: "Khách đã có tài khoản thành viên. Dùng nạp thêm." };
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.validityDays);

  try {
    const account = await prisma.memberAccount.create({
      data: {
        customerId,
        package: config.key,
        balance: config.bonus * 1000, // lưu theo đơn vị VND (bonus tính bằng nghìn)
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

    revalidatePath("/members");
    return { success: true, accountId: account.id };
  } catch (e) {
    console.error("createMemberAccount error:", e);
    return { error: "Không tạo được tài khoản thành viên." };
  }
};

/**
 * Nạp thêm tiền vào tài khoản thành viên (recharge).
 */
export const rechargeMember = async (
  _prev: any,
  formData: FormData,
) => {
  await requireRole(["ADMIN", "SUPERVISOR"]);

  const accountId = Number(formData.get("accountId"));
  const packageKey = formData.get("package")?.toString();

  if (!accountId || !packageKey) {
    return { error: "Thiếu thông tin." };
  }

  const config = getPackageConfig(packageKey);
  if (!config) {
    return { error: "Gói không hợp lệ." };
  }

  try {
    const account = await prisma.memberAccount.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      return { error: "Không tìm thấy tài khoản." };
    }

    // extend expiry from now (or from current expiry if not yet expired)
    const base = account.expiresAt > new Date() ? account.expiresAt : new Date();
    const newExpiry = new Date(base);
    newExpiry.setDate(newExpiry.getDate() + config.validityDays);

    await prisma.memberAccount.update({
      where: { id: accountId },
      data: {
        balance: { increment: config.bonus * 1000 },
        package: config.key,
        expiresAt: newExpiry,
        transactions: {
          create: {
            amount: config.bonus * 1000,
            type: "RECHARGE",
            note: `Nạp thêm ${config.label} — ${config.deposit}K → +${config.bonus}K`,
          },
        },
      },
    });

    revalidatePath("/members");
    return { success: true };
  } catch (e) {
    console.error("rechargeMember error:", e);
    return { error: "Nạp thêm thất bại." };
  }
};

/**
 * Lấy thông tin tài khoản thành viên của một khách hàng.
 */
export async function getMemberByCustomerId(customerId: number) {
  return prisma.memberAccount.findUnique({
    where: { customerId },
    include: {
      transactions: {
        orderBy: { dateCreated: "desc" },
        take: 20,
        include: { bill: { select: { id: true } } },
      },
      customer: { select: { name: true, phone: true } },
    },
  });
}

/**
 * Lấy danh sách tất cả tài khoản thành viên.
 */
export async function getAllMembers() {
  return prisma.memberAccount.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, phone: true } },
    },
  });
}

export type MemberDeductionPreview = {
  expired: boolean;
  /** Số dư ví trước khi trừ (VND) */
  balance: number;
  /** Số sẽ trừ từ ví (VND), không vượt số dư */
  deducted: number;
  /** Phần khách thanh toán thêm bằng tiền mặt (VND) */
  shortage: number;
};

function formatShortageNote(shortageVnd: number) {
  const k = shortageVnd / 1000;
  const kLabel = Number.isInteger(k) ? String(k) : k.toLocaleString("vi-VN");
  return `KH thanh toán thêm ${kLabel}K`;
}

function appendShortageNote(existing: string, shortageVnd: number) {
  const extra = formatShortageNote(shortageVnd);
  const trimmed = existing.trim();
  return trimmed ? `${trimmed} — ${extra}` : extra;
}

/**
 * Xem trước trừ ví khi tạo bill (không ghi DB).
 * Ví không âm: chỉ trừ tối đa số còn lại, phần thiếu là tiền mặt.
 */
export async function previewMemberDeduction(
  customerId: number,
  amountVnd: number,
): Promise<MemberDeductionPreview | null> {
  const account = await prisma.memberAccount.findUnique({
    where: { customerId },
  });
  if (!account) return null;

  if (account.expiresAt < new Date()) {
    return {
      expired: true,
      balance: account.balance,
      deducted: 0,
      shortage: 0,
    };
  }

  const available = Math.max(account.balance, 0);
  const deducted = Math.min(available, amountVnd);
  return {
    expired: false,
    balance: available,
    deducted,
    shortage: amountVnd - deducted,
  };
}

/**
 * Trừ số dư thành viên khi tạo bill.
 * Ví không xuống âm: hết dư thì dừng, phần thiếu trả tiền mặt.
 */
export async function deductMemberBalance(
  customerId: number,
  amount: number, // đơn vị VND thực tế (đã x1000 nếu cần)
  billId: number,
) {
  const preview = await previewMemberDeduction(customerId, amount);
  if (!preview) return null;
  if (preview.expired) {
    return { expired: true as const, balance: preview.balance, shortage: 0 };
  }

  if (preview.deducted <= 0) {
    return {
      expired: false as const,
      balance: preview.balance,
      shortage: preview.shortage,
    };
  }

  const newBalance = preview.balance - preview.deducted;
  const shortageNote =
    preview.shortage > 0
      ? ` — ${formatShortageNote(preview.shortage)}`
      : "";

  await prisma.memberAccount.update({
    where: { customerId },
    data: {
      balance: newBalance,
      transactions: {
        create: {
          amount: -preview.deducted,
          type: "DEDUCTION",
          billId,
          note: `Trừ bill #${billId}${shortageNote}`,
        },
      },
    },
  });

  return {
    expired: false as const,
    balance: newBalance,
    shortage: preview.shortage,
  };
}

/**
 * Hoàn số đã trừ ví khi xóa bill. Chỉ hoàn phần DEDUCTION gắn bill đó.
 */
export async function refundMemberBalanceForBill(billId: number) {
  const deduction = await prisma.memberTransaction.findUnique({
    where: { billId },
  });
  if (!deduction || deduction.type !== "DEDUCTION") return null;

  const refundAmount = Math.abs(deduction.amount);

  await prisma.$transaction([
    prisma.memberTransaction.delete({
      where: { id: deduction.id },
    }),
    prisma.memberAccount.update({
      where: { id: deduction.memberAccountId },
      data: {
        balance: { increment: refundAmount },
        transactions: {
          create: {
            amount: refundAmount,
            type: "DEPOSIT",
            note: `Hoàn bill #${billId} (đã xóa)`,
          },
        },
      },
    }),
  ]);

  return { refunded: refundAmount };
}
