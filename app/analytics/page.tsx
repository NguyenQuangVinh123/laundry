/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { formatDate, formatDateNotHour } from "@/lib/utils";
import { saveFixedExpense } from "@/lib/actions";
import { useFormState } from "react-dom";

interface Customer {
  id: string;
  name: string;
  dateCreated: string;
}

interface MonthData {
  month: string;
  total: number;
  customer_count: number;
}

interface FixedExpense {
  id: number;
  amount: number;
  month: number;
  year: number;
}

interface AnalyticsData {
  revenue: number;
  previousRevenue: number;
  revenueChange: number;
  customer427Spending: number;
  customer427PrevSpending: number;
  customer427SpendingChange: number;
  customer427Bills: {
    id: number;
    amount: number;
    dateCreated: string;
    note: string;
  }[];
  newCustomers: Customer[];
  totalNewCustomers: number;
  allMonthsData: MonthData[];
  fixedExpense: FixedExpense | null;
}

export default function AnalyticsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [fixedExpenseAmount, setFixedExpenseAmount] = useState("");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const [formState, formAction] = useFormState(saveFixedExpense, null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/analytics?month=${selectedMonth}&year=${selectedYear}`
      );
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (formState?.success) {
      setFixedExpenseAmount("");
      fetchAnalytics();
    }
  }, [formState]);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Monthly Analytics</h1>
        
        {/* Month/Year Selector with better mobile styling */}
        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
          <select
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border rounded-lg bg-white shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border rounded-lg bg-white shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from(
              { length: 2 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-8">
          {/* Overview Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Revenue Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Revenue Overview</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <p className="text-2xl sm:text-4xl font-bold text-blue-600">
                        {analyticsData?.revenue?.toLocaleString() || 0} VNĐ
                      </p>
                      {analyticsData?.revenueChange !== undefined &&
                        analyticsData.revenueChange !== 0 && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                              analyticsData.revenueChange > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {analyticsData.revenueChange > 0 ? "↑" : "↓"}
                            {Math.abs(analyticsData.revenueChange).toFixed(1)}%
                          </span>
                        )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      Previous Month: {analyticsData?.previousRevenue?.toLocaleString() || 0} VNĐ
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4 mt-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Profit Overview</h2>
                </div>
                {analyticsData?.fixedExpense ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <p className="text-2xl sm:text-4xl font-bold text-green-600">
                          {(analyticsData?.revenue - analyticsData?.fixedExpense?.amount).toLocaleString()} VNĐ
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2">
                          Fixed expense: {analyticsData?.fixedExpense?.amount.toLocaleString()} VNĐ
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form action={formAction} className="space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <input
                          type="number"
                          name="amount"
                          value={fixedExpenseAmount}
                          onChange={(e) => setFixedExpenseAmount(e.target.value)}
                          placeholder="Fixed expense this month"
                          required
                          className="flex-1 min-w-[150px] px-3 py-2 border rounded-lg bg-white shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        />
                        <input type="hidden" name="month" value={selectedMonth} />
                        <input type="hidden" name="year" value={selectedYear} />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                        >
                          Save
                        </button>
                      </div>
                      {formState?.message && !formState.success && (
                        <p className="text-sm text-red-500 mt-2">{formState.message}</p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Customer 427 Spending Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Total Expenses</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <p className="text-2xl sm:text-4xl font-bold text-yellow-600">
                        {analyticsData?.customer427Spending?.toLocaleString() || 0} VNĐ
                      </p>
                      {analyticsData?.customer427SpendingChange !== undefined &&
                        analyticsData.customer427SpendingChange !== 0 && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                              analyticsData.customer427SpendingChange > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {analyticsData.customer427SpendingChange > 0 ? "↑" : "↓"}
                            {Math.abs(analyticsData.customer427SpendingChange).toFixed(1)}%
                          </span>
                        )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        Previous Month: {analyticsData?.customer427PrevSpending?.toLocaleString() || 0} VNĐ
                    </p>
                  </div>
                  {/* Expenses List */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {analyticsData?.customer427Bills?.length || 0} Expenses
                      </span>
                    </div>
                    <div className="overflow-auto max-h-[350px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {analyticsData?.customer427Bills && analyticsData.customer427Bills.length > 0 ? (
                        <div className="space-y-2">
                          {analyticsData.customer427Bills.map((bill) => (
                            <div key={bill.id} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100">
                              <div className="flex-1">
                                <span className="text-xs text-gray-900">{formatDateNotHour(new Date(bill.dateCreated))}</span>
                              </div>
                              <div className="flex-1 text-left">
                                <span className="text-xs font-medium text-gray-900">{bill.amount.toLocaleString()} VNĐ</span>
                              </div>
                              {bill.note && (
                                <div className="flex-1 text-left">
                                  <span className="text-xs text-gray-500">{bill.note}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-16 text-xs text-gray-500">
                          No bills for this month
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* New Customers List Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">New Customers</h2>
                  <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium">
                    {analyticsData?.totalNewCustomers || 0} Total
                  </span>
                </div>
                <div className="overflow-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {analyticsData?.newCustomers &&
                  analyticsData.newCustomers.length > 0 ? (
                    <table className="min-w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            First Visit
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analyticsData.newCustomers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                              {customer.name}
                            </td>
                            <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {formatDate(new Date(customer.dateCreated))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex items-center justify-center h-24 sm:h-32 text-sm text-gray-500">
                      No new customers this month
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Historical Data Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Historical Revenue</h2>
                <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium">
                  Last 12 Months
                </span>
              </div>
              <div className="space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {analyticsData?.allMonthsData &&
                analyticsData.allMonthsData.length > 0 ? (
                  <div className="grid gap-3 sm:gap-4">
                    {analyticsData.allMonthsData.map((monthData: MonthData) => (
                      <div
                        key={monthData.month}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm sm:text-base text-gray-700 font-medium mb-2 sm:mb-0">
                          {new Date(monthData.month).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <div className="flex flex-wrap gap-2 sm:gap-6 items-center">
                          <span className="text-sm sm:text-base text-blue-600 font-semibold">
                            {monthData.total.toLocaleString()} VNĐ
                          </span>
                          <span className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm">
                            {monthData.customer_count} customers
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 sm:h-32 text-sm text-gray-500">
                    No historical data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
