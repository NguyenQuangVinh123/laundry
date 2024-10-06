import { prisma } from "@/lib/prisma";


export const getBills = async (query: string) => {
  try {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
    const dateFilter = query ? {} : {
      dateCreated: {
        gte: startOfDay,
        lte: endOfDay,
      }
    };
    const contacts = await prisma.bill.findMany({
      where: {
        customer: {
          name: {
            contains: query,
            mode: "insensitive"
          }
        },
        ...dateFilter
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

export const getTotalMonth = async () => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

    const totalAmount = await prisma.bill.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        dateCreated: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    });
    return totalAmount._sum.amount;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};

export const getTotalDate = async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set to midnight (start of the day)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set to the last millisecond of the day

    const totalAmount = await prisma.bill.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        dateCreated: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });
    return totalAmount._sum.amount;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};