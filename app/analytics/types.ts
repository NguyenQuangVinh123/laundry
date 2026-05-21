export interface AnalyticsCustomer {
  id: string;
  name: string;
  dateCreated: string;
}

export interface MonthData {
  month: string;
  total: number;
  customer_count: number;
}

export interface FixedExpense {
  id: number;
  amount: number;
  month: number;
  year: number;
}

export interface AnalyticsData {
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
  newCustomers: AnalyticsCustomer[];
  totalNewCustomers: number;
  allMonthsData: MonthData[];
  fixedExpense: FixedExpense | null;
}

export const MONTH_LABELS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
] as const;
