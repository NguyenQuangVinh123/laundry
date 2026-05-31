"use server";
import { prisma } from "@/lib/prisma";
import { requireSession, requireRole } from "@/lib/auth";
import { canEditBillNoteOnly, canManageBills } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function resolveCustomerId(raw: string): Promise<number> {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Customer is required");
  }

  const asId = Number(trimmed);
  if (!Number.isNaN(asId) && asId > 0) {
    const byId = await prisma.customer.findUnique({ where: { id: asId } });
    if (byId) return byId.id;
  }

  const byName = await prisma.customer.findFirst({
    where: {
      name: { equals: trimmed, mode: "insensitive" },
    },
  });
  if (byName) return byName.id;

  const created = await prisma.customer.create({
    data: { name: trimmed },
  });
  return created.id;
}

export const saveContact = async (prevSate: any, formData: FormData) => {
  const session = await requireSession();

  let customerId: number;
  try {
    customerId = await resolveCustomerId(
      (formData.get("customerId") as string) ?? ""
    );
  } catch {
    return { message: "Vui lòng chọn hoặc nhập tên khách hàng" };
  }

  try {
    await prisma.bill.create({
      data: {
        customerId: customerId,
        amount: Number(formData.get("amount")),
        note: formData.get("note")?.toString() ?? "",
        createdById: session.id,
      },
    });
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        totalUsed: {
          increment: 1
        },
        dateUsed: {
          push : new Date()
        }
      }
    })
  } catch (error) {
    return { message: "Failed to create contact" };
  }
  revalidatePath("/contacts");
  redirect("/contacts");
};


export const saveCustomer = async (prevSate: any, formData: FormData) => {
  try {
    await prisma.customer.create({
      data: {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string
      },
    });
  } catch (error) {
    return { message: "Failed to create contact" };
  }

  revalidatePath("/customers");
  redirect("/customers");
};

export const updateContact = async (prevSate: any, formData: FormData) => {
  const session = await requireSession();
  const billId = Number(formData.get("id"));
  const note = formData.get("note")?.toString() ?? "";

  if (!billId || Number.isNaN(billId)) {
    return { message: "Bill không hợp lệ" };
  }

  try {
    if (canManageBills(session.role)) {
      await prisma.bill.update({
        where: { id: billId },
        data: {
          amount: Number(formData.get("amount")),
          note,
        },
      });
    } else if (canEditBillNoteOnly(session.role)) {
      await prisma.bill.update({
        where: { id: billId },
        data: { note },
      });
    } else {
      return { message: "Không có quyền sửa bill" };
    }
  } catch (error) {
    return { message: "Failed to update contact" };
  }
  revalidatePath("/contacts");
  redirect("/contacts");
};

export const deleteContact = async (customerId: number) => {
  try {
    // Delete bills associated with the customer
    await prisma.bill.deleteMany({
      where: { customerId: customerId },
    });

    // Delete the customer
    await prisma.customer.delete({
      where: { id: customerId },
    });

    return { message: "Contact deleted successfully" };
  } catch (error) {
    return { message: "Failed to delete contact" };
  }
};

export const saveFixedExpense = async (prevState: any, formData: FormData) => {
  await requireRole(["ADMIN", "SUPERVISOR"]);

  try {
    const amount = Number(formData.get("amount"));
    const month = Number(formData.get("month"));
    const year = Number(formData.get("year"));

    if (isNaN(amount) || isNaN(month) || isNaN(year)) {
      return { message: "Invalid input data" };
    }

    // Use upsert to create or update fixed expense for the month/year
    await prisma.fixedExpense.upsert({
      where: {
        month_year: {
          month: month,
          year: year,
        },
      },
      update: {
        amount: amount,
      },
      create: {
        amount: amount,
        month: month,
        year: year,
      },
    });

    revalidatePath("/analytics");
    return { success: true, message: "Fixed expense saved successfully" };
  } catch (error) {
    console.error("Failed to save fixed expense:", error);
    return { message: "Failed to save fixed expense" };
  }
};

export const getFixedExpense = async (month: number, year: number) => {
  try {
    const expense = await prisma.fixedExpense.findUnique({
      where: {
        month_year: {
          month: month,
          year: year,
        },
      },
    });

    return expense;
  } catch (error) {
    console.error("Failed to get fixed expense:", error);
    return null;
  }
};