import { prisma } from "@/lib/prisma";
import { getUtcDayBounds, normalizeForSearch } from "@/lib/utils";

export const getBills = async (query: string, date?: string) => {
  try {
    const { startOfDay, endOfDay } = getUtcDayBounds(date?.trim() || undefined);
    const searchTerm = query.trim();

    // Tên: so khớp không dấu / không phân biệt hoa thường (Prisma contains không làm được)
    let customerIds: number[] | undefined;
    if (searchTerm) {
      const customers = await prisma.customer.findMany({
        select: { id: true, name: true },
      });
      const normalizedQuery = normalizeForSearch(searchTerm);
      customerIds = customers
        .filter((c) =>
          normalizeForSearch(c.name).includes(normalizedQuery)
        )
        .map((c) => c.id);

      if (customerIds.length === 0) {
        return [];
      }
    }

    return prisma.bill.findMany({
      where: {
        dateCreated: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ...(customerIds ? { customerId: { in: customerIds } } : {}),
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        dateCreated: "desc",
      },
    });
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
    const currentDate = new Date();
    const startOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 1, 0, 0, 0));

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

export const getTotalDate = async (date?: string) => {
  try {
    const { startOfDay, endOfDay } = getUtcDayBounds(date);

    const totalAmount = await prisma.bill.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        dateCreated: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    return totalAmount._sum.amount;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};

export const getTotalByDayOfMonth = async () => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getUTCMonth();
    const currentYear = currentDate.getUTCFullYear();
    const currentDay = currentDate.getUTCDate(); // Get current day of the month

    const dailyTotals = [];

    for (let day = 1; day <= currentDay; day++) { // Loop only up to the current day
      const startOfDay = new Date(Date.UTC(currentYear, currentMonth, day, 0, 0, 0));
      const endOfDay = new Date(Date.UTC(currentYear, currentMonth, day, 23, 59, 59, 999));

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

      const totalBill = await prisma.bill.count({
        where: {
          dateCreated: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });

      dailyTotals.push({
        date: startOfDay,
        total: totalAmount._sum.amount || 0,
        totalBill: totalBill,
      });
    }

    return dailyTotals;
  } catch (error) {
    throw new Error("Failed to fetch daily totals up to the current date");
  }
};
export const getBillById = async (billId: number) => {
  try {
    const bill = await prisma.bill.findUnique({
      where: {
        id: billId,
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!bill) {
      return null
    }
    return bill;
  } catch (error) {
    return null
  }
};