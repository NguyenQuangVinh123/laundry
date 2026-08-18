export type MemberPackageConfig = {
  key: "INDIVIDUAL" | "FAMILY" | "SPA_HOTEL";
  label: string;
  deposit: number;    // số tiền nạp (nghìn VND)
  bonus: number;      // số dư nhận được (nghìn VND)
  extra: number;      // tặng thêm (nghìn VND)
  validityDays: number;
  description: string;
};

export const MEMBER_PACKAGES: MemberPackageConfig[] = [
  {
    key: "INDIVIDUAL",
    label: "Gói Cá Nhân",
    deposit: 300,
    bonus: 340,
    extra: 40,
    validityDays: 90,
    description: "Phù hợp 1 người",
  },
  {
    key: "FAMILY",
    label: "Gói Gia Đình",
    deposit: 600,
    bonus: 680,
    extra: 80,
    validityDays: 120,
    description: "Phù hợp gia đình",
  },
  {
    key: "SPA_HOTEL",
    label: "Gói Spa / Khách Sạn",
    deposit: 1000,
    bonus: 1120,
    extra: 120,
    validityDays: 120,
    description: "Phù hợp spa, homestay, khách sạn nhỏ",
  },
];

export function getPackageConfig(key: string): MemberPackageConfig | undefined {
  return MEMBER_PACKAGES.find((p) => p.key === key);
}
