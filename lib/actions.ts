"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const saveContact = async (prevSate: any, formData: FormData) => {
  const getListCustomer = await prisma.customer.findMany()
  const listNameCustomer = getListCustomer.map(i => i.id)
  let customerId = Number(formData.get("customerId"))
  if(!listNameCustomer.includes(customerId)) {
    const res = await prisma.customer.create({
      data: {
        name: formData.get("customerId") as string
      }
    })
    customerId = res.id
  }

  try {
    await prisma.bill.create({
      data: {
        customerId: customerId,
        amount: Number(formData.get("amount"))
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