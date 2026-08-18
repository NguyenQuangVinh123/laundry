export function formatBillAmount(amount: number) {
  return `${amount.toLocaleString("vi-VN")} VNĐ`;
}

export const BILL_COMPLETE_TITLE = "Đơn hàng của quý khách đã hoàn tất.";
export const BILL_COMPLETE_NOTE =
  "Cảm ơn quý khách đã tin tưởng sử dụng dịch vụ tại Tiệm Giặt Sấy Nhà Uyên";

export function buildBillCompleteMessage(amount: number, billId: string | null) {
  return [
    "✨━━━━━━━━━━━━━━━━━━━✨",
    "",
    "🧺 TIỆM GIẶT SẤY NHÀ UYÊN",
    "",
    "✅ Đơn hàng của quý khách đã hoàn tất.",
    "",
    `🔖 Mã đơn: #${billId ?? "—"}`,
    `💰 Giá tiền: ${formatBillAmount(amount)}`,
    "",
    "Cảm ơn quý khách đã tin tưởng sử dụng",
    "dịch vụ tại Tiệm Giặt Sấy Nhà Uyên ❤️",
    "",
    "✨━━━━━━━━━━━━━━━━━━━✨",
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
