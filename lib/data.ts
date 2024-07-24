import { prisma } from "@/lib/prisma";


export const getBills = async (query: string) => {
  try {
    const contacts = await prisma.bill.findMany({
      include: {
        customer: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        dateCreated: 'desc',
      }
    });

    return contacts;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};

export const getCustomers = async (query: string) => {
  try {
    const contacts = await prisma.customer.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive"
        }
      }
    });
    return contacts;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};
