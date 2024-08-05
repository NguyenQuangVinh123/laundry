"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const saveContact = async (prevSate: any, formData: FormData) => {
  const customerIdInput = Number(formData.get("customerId"));
  const amount = Number(formData.get("amount"));

  try {
    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      let customerId = customerIdInput;
      let customer = await prisma.customer.findUnique({
        where: { id: customerId || 0 },
      });

      // If customer doesn't exist, create a new one
      if (!customer) {
        customer = await prisma.customer.create({
          data: { name: formData.get("customerId") as string },
        });
        customerId = customer.id;
      }

      // Create a new bill and update the customer record
      await prisma.bill.create({
        data: {
          customerId: customerId,
          amount,
        },
      });

      await prisma.customer.update({
        where: { id: customerId },
        data: {
          totalUsed: { increment: 1 },
          dateUsed: { push: new Date() },
        },
      });

      return customerId;
    });
    // Redirect and revalidate
   
  } catch (error) {
    console.error("Error saving contact:", error);
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