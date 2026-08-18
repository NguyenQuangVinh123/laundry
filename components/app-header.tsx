import { logoutAction } from "@/lib/auth-actions";
import { roleLabel, type UserRole } from "@/lib/permissions";
import Link from "next/link";

export default function AppHeader({
  name,
  role,
}: {
  name: string;
  role: UserRole;
}) {
  return (
    <header className="max-w-screen-lg mx-auto flex items-center justify-between gap-2 px-2 pt-3">
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium text-gray-800">{name}</span>
        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs text-pink-700">
          {roleLabel(role)}
        </span>
        <Link
          href="/members"
          className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-2 py-1"
        >
          Thành viên
        </Link>
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="text-sm text-gray-600 hover:text-red-600 border border-gray-200 rounded-lg px-3 py-1.5"
        >
          Đăng xuất
        </button>
      </form>
    </header>
  );
}
