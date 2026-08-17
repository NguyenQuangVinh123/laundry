export function formatBillAmount(amount: number) {
  return `${amount.toLocaleString("vi-VN")} VNĐ`;
}

export const BILL_COMPLETE_TITLE = "Đơn hàng của quý khách đã hoàn tất.";
export const BILL_COMPLETE_NOTE =
  "Nếu quý khách chuyển khoản thì vui lòng gửi hình chụp bill.";

export function buildBillCompleteMessage(amount: number) {
  return [
    BILL_COMPLETE_TITLE,
    `Giá tiền: ${formatBillAmount(amount)}`,
    BILL_COMPLETE_NOTE,
  ].join("\n");
}

export function buildVietQrUrl(amount: number) {
  const params = new URLSearchParams({
    amount: String(Math.round(Math.abs(amount))),
    addInfo: "Nha Uyen",
    accountName: "HO KINH DOANH GIAT SAY NHA UYEN",
  });
  return `https://img.vietqr.io/image/BIDV-8858393249-compact2.png?${params.toString()}`;
}
