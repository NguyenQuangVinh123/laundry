export type UserRole = "ADMIN" | "SUPERVISOR" | "EMPLOYEE";

export function canViewAnalytics(role: UserRole) {
  return role === "ADMIN" || role === "SUPERVISOR";
}

export function canViewFinancialTotals(role: UserRole) {
  return role === "ADMIN" || role === "SUPERVISOR";
}

export function canManageBills(role: UserRole) {
  return role === "ADMIN";
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "Quản trị";
    case "SUPERVISOR":
      return "Giám sát";
    case "EMPLOYEE":
      return "Nhân viên";
    default:
      return role;
  }
}
