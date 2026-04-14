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