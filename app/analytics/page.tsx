/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

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

interface AnalyticsData {
  revenue: number;
  previousRevenue: number;
  revenueChange: number;
  newCustomers: Customer[];
  totalNewCustomers: number;
  allMonthsData: MonthData[];
}

export default function AnalyticsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Monthly Analytics</h1>

      {/* Month/Year Selector */}
      <div className="flex gap-4 mb-8">
        <select
          className="p-2 border rounded"
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
          className="p-2 border rounded"
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Current Month Overview */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Current Month Overview
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Revenue</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-blue-600">
                      {analyticsData?.revenue?.toLocaleString() || 0} VNĐ
                    </p>
                    {analyticsData?.revenueChange !== undefined &&
                      analyticsData.revenueChange !== 0 && (
                        <span
                          className={`text-sm font-semibold ${
                            analyticsData.revenueChange > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {analyticsData.revenueChange > 0 ? "↑" : "↓"}
                          {Math.abs(analyticsData.revenueChange).toFixed(1)}%
                        </span>
                      )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Previous Month:{" "}
                    {analyticsData?.previousRevenue?.toLocaleString() || 0} VNĐ
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">New Customers</p>
                  <p className="text-3xl font-bold text-green-600">
                    {analyticsData?.totalNewCustomers || 0}
                  </p>
                </div>
              </div>
            </div>
            {/* New Customers List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">New Customers</h2>
              <div className="overflow-auto max-h-[400px]">
                {analyticsData?.newCustomers &&
                analyticsData.newCustomers.length > 0 ? (
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          First Visit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analyticsData.newCustomers.map((customer) => (
                        <tr key={customer.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {customer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(new Date(customer.dateCreated))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No new customers this month</p>
                )}
              </div>
            </div>
            {/* Historical Data */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Historical Revenue</h2>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {analyticsData?.allMonthsData &&
                analyticsData.allMonthsData.length > 0 ? (
                  analyticsData.allMonthsData.map((monthData: MonthData) => (
                    <div
                      key={monthData.month}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                    >
                      <span className="text-gray-600">
                        {new Date(monthData.month).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <div className="flex gap-4">
                        <span className="text-blue-600 font-semibold">
                          {monthData.total.toLocaleString()} VNĐ
                        </span>
                        <span className="text-gray-500">
                          ({monthData.customer_count} customers)
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No historical data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
