import { prisma } from "@/lib/prisma";


export const getBills = async (query: string, date?: string) => {
  try {
    let startOfDay, endOfDay;
    if (date) {
      const selectedDate = new Date(date);
      startOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 0, 0, 0));
      endOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 23, 59, 59, 999));
    } else {
      const currentDate = new Date();
      startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
      endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
    }
    const dateFilter = {
      dateCreated: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };
    const contacts = await prisma.bill.findMany({
      where: {
        customer: {
          name: {
            contains: query,
            mode: "insensitive"
          }
        },
        ...(query ? (date ? dateFilter : {}) : dateFilter),
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

export const getTotalByDayOfMonth = async () => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate(); // Get current day of the month

    const dailyTotals = [];

    for (let day = 1; day <= currentDay; day++) { // Loop only up to the current day
      const startOfDay = new Date(currentYear, currentMonth, day);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(currentYear, currentMonth, day);
      endOfDay.setHours(23, 59, 59, 999);

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