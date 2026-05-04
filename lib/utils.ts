export const formatDate = (dateStr: Date) => {
  const date = new Date(dateStr.getTime() + dateStr.getTimezoneOffset() * 60000 + (7 * 60 * 60000));
  // Extract date components
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  // Extract time components
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Format as DD/MM/YYYY hh:mm
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/** Thứ trong tuần (VN), cùng offset múi giờ với formatDate */
const VI_WEEKDAYS = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
] as const;

export const formatWeekdayVi = (dateStr: Date) => {
  const date = new Date(
    dateStr.getTime() +
      dateStr.getTimezoneOffset() * 60000 +
      7 * 60 * 60000
  );
  return VI_WEEKDAYS[date.getDay()];
};

export const formatDateNotHour = (dateStr: Date) => {
  const date = new Date(dateStr.getTime() + dateStr.getTimezoneOffset() * 60000 + (7 * 60 * 60000));
  // Extract date components
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  // Format as DD/MM/YYYY hh:mm
  return `${day}/${month}/${year}`;
};

export const getUtcDayBounds = (date?: string) => {
  const trimmed = date?.trim();
  let d: Date;
  if (trimmed) {
    const parsed = new Date(trimmed);
    d = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  } else {
    d = new Date();
  }
  const startOfDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
  const endOfDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  return { startOfDay, endOfDay };
};