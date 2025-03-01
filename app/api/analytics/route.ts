import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") ?? new Date().getMonth();
    const year = searchParams.get("year") ?? new Date().getFullYear();

    // Get start and end of the current month
    const startOfMonth = new Date(Number(year), Number(month), 1);
    const endOfMonth = new Date(Number(year), Number(month) + 1, 0);

    // Get start and end of the previous month
    const startOfPrevMonth = new Date(Number(year), Number(month) - 1, 1);
    const endOfPrevMonth = new Date(Number(year), Number(month), 0);

    // Get current month revenue
    const monthlyRevenue = await prisma.bill.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        dateCreated: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Get previous month revenue
    const prevMonthRevenue = await prisma.bill.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        dateCreated: {
          gte: startOfPrevMonth,
          lte: endOfPrevMonth,
        },
      },
    });

    // Get monthly data for the last 12 months
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d;
    });

    const monthlyData = await Promise.all(
      last12Months.map(async (date) => {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthData = await prisma.bill.aggregate({
          _sum: {
            amount: true,
          },
          _count: {
            customerId: true,
          },
          where: {
            dateCreated: {
              gte: start,
              lte: end,
            },
          },
        });

        return {
          month: start,
          total: monthData._sum.amount || 0,
          customer_count: monthData._count.customerId || 0,
        };
      })
    );

    // Filter out months with zero revenue
    const nonZeroMonths = monthlyData.filter(month => month.total > 0);

    // Get new customers
    const customers = await prisma.customer.findMany({
      where: {
        dateUsed: {
          hasSome: [startOfMonth]
        }
      },
      select: {
        id: true,
        name: true,
        dateUsed: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    const newCustomers = customers.filter((customer) => {
      const firstVisit = new Date(Math.min(...customer.dateUsed.map(d => d.getTime())));
      return firstVisit >= startOfMonth && firstVisit <= endOfMonth;
    });

    // Calculate month-over-month changes
    const currentRevenue = monthlyRevenue._sum.amount || 0;
    const previousRevenue = prevMonthRevenue._sum.amount || 0;
    const revenueChange = previousRevenue ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    return NextResponse.json({
      revenue: currentRevenue,
      previousRevenue: previousRevenue,
      revenueChange: revenueChange,
      newCustomers: newCustomers.map(customer => ({
        id: customer.id,
        name: customer.name,
        dateCreated: Math.min(...customer.dateUsed.map(d => d.getTime())),
      })),
      totalNewCustomers: newCustomers.length,
      allMonthsData: nonZeroMonths,
    });
  } catch (error) {
    console.error("Error in analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data", details: error },
      { status: 500 }
    );
  }
} 