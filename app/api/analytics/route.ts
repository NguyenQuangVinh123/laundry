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
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(Number(year), Number(month) + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Get start and end of the previous month
    const startOfPrevMonth = new Date(Number(year), Number(month) - 1, 1);
    startOfPrevMonth.setHours(0, 0, 0, 0);
    const endOfPrevMonth = new Date(Number(year), Number(month), 0);
    endOfPrevMonth.setHours(23, 59, 59, 999);

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

    // Get current month spending for customer 427
    const customer427Spending = await prisma.bill.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        customerId: 427,
        dateCreated: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Get detailed bills for customer 427 in current month
    const customer427Bills = await prisma.bill.findMany({
      where: {
        customerId: 427,
        dateCreated: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      orderBy: {
        dateCreated: 'desc',
      },
    });

    // Get previous month spending for customer 427
    const customer427PrevSpending = await prisma.bill.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        customerId: 427,
        dateCreated: {
          gte: startOfPrevMonth,
          lte: endOfPrevMonth,
        },
      },
    });

    // Calculate spending change percentage
    const currentSpending = customer427Spending._sum.amount || 0;
    const previousSpending = customer427PrevSpending._sum.amount || 0;
    const spendingChange = previousSpending ? ((currentSpending - previousSpending) / previousSpending) * 100 : 0;

    // Get monthly data for the last 12 months
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setDate(1); // Đặt ngày về 1 để tránh lỗi ngày tháng
      d.setHours(0, 0, 0, 0);
      d.setMonth(d.getMonth() - i);
      return new Date(d); // Tạo một bản sao để không bị thay đổi ngoài ý muốn
    });

    const monthlyData = await Promise.all(
      last12Months.map(async (date) => {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);

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
      select: {
        id: true,
        name: true,
        dateUsed: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Filter to find customers whose earliest dateUsed is in the current month
    const newCustomers = customers.filter(customer => {
      if (!customer.dateUsed || customer.dateUsed.length === 0) return false;
      
      // Find the earliest date for this customer
      const earliestDate = new Date(Math.min(...customer.dateUsed.map(d => d.getTime())));
      
      // Check if this earliest date falls within our target month
      return earliestDate >= startOfMonth && earliestDate <= endOfMonth;
    });

    // Get fixed expense for the selected month/year
    const fixedExpense = await prisma.fixedExpense.findUnique({
      where: {
        month_year: {
          month: Number(month),
          year: Number(year),
        },
      },
    });

    // Calculate month-over-month changes
    const currentRevenue = monthlyRevenue._sum.amount || 0;
    const previousRevenue = prevMonthRevenue._sum.amount || 0;
    const revenueChange = previousRevenue ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    return NextResponse.json({
      revenue: currentRevenue,
      previousRevenue: previousRevenue,
      revenueChange: revenueChange,
      customer427Spending: currentSpending,
      customer427PrevSpending: previousSpending,
      customer427SpendingChange: spendingChange,
      customer427Bills: customer427Bills,
      newCustomers: newCustomers.map(customer => ({
        id: customer.id,
        name: customer.name,
        dateCreated: Math.min(...customer.dateUsed.map(d => d.getTime())),
      })),
      totalNewCustomers: newCustomers.length,
      allMonthsData: nonZeroMonths,
      fixedExpense: fixedExpense ? {
        id: fixedExpense.id,
        amount: fixedExpense.amount,
        month: fixedExpense.month,
        year: fixedExpense.year,
      } : null,
    });
  } catch (error) {
    console.error("Error in analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data", details: error },
      { status: 500 }
    );
  }
} 