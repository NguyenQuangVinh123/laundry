import { prisma } from "@/lib/prisma";


export const getBills = async (query: string) => {
  try {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
    const contacts = await prisma.bill.findMany({
      where: {
        customer: {
          name: {
            contains: query,
            mode: "insensitive"
          }
        },
        dateCreated : {
          gte: startOfDay,
          lte: endOfDay,
        }
      },
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
    console.error("Error fetching bills:", error);
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
        },
      },
      orderBy: {
        id: 'desc',
      }
    });
    return contacts;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};
