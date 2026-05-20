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

/** Chuẩn hóa chuỗi để tìm kiếm: không phân biệt hoa thường, bỏ dấu tiếng Việt. */
export function normalizeForSearch(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Đầu/cuối ngày theo giờ Việt Nam (UTC+7). `date` dạng YYYY-MM-DD từ ô chọn ngày. */
export const getUtcDayBounds = (date?: string) => {
  let y: number;
  let m: number;
  let d: number;

  const trimmed = date?.trim();
  if (trimmed && /^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [ys, ms, ds] = trimmed.split("-").map(Number);
    y = ys;
    m = ms - 1;
    d = ds;
  } else {
    const vnNow = new Date(Date.now() + VN_OFFSET_MS);
    y = vnNow.getUTCFullYear();
    m = vnNow.getUTCMonth();
    d = vnNow.getUTCDate();
  }

  const startOfDay = new Date(Date.UTC(y, m, d, 0, 0, 0, 0) - VN_OFFSET_MS);
  const endOfDay = new Date(Date.UTC(y, m, d, 23, 59, 59, 999) - VN_OFFSET_MS);
  return { startOfDay, endOfDay };
};