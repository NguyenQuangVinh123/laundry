import { requireSession } from "@/lib/auth";
import { canManageMembers, canRegisterMember } from "@/lib/permissions";
import { getAllMembers } from "@/lib/member-actions";
import { getCustomers } from "@/lib/data";
import MemberList from "./member-list";
import BackToContacts from "@/components/back-to-contacts";

export default async function MembersPage() {
  const session = await requireSession();
  const canRegister = canRegisterMember(session.role);
  const canManage = canManageMembers(session.role);

  const [rawMembers, customers] = await Promise.all([
    getAllMembers(),
    getCustomers(""),
  ]);
  const members = rawMembers.map((m: (typeof rawMembers)[number]) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
    expiresAt: m.expiresAt.toISOString(),
    package: m.package,
  }));

  return (
    <div className="max-w-screen-lg mx-auto p-2">
      <BackToContacts />
      <h1 className="text-2xl font-bold text-center mb-4 text-pink-800">
        Quản lý thành viên
      </h1>
      <MemberList
        members={members}
        canRegister={canRegister}
        canManage={canManage}
        customers={customers.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
