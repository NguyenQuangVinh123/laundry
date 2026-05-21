import {
  getBills,
  getTotalByDayOfMonth,
  getTotalDate,
  getTotalMonth,
} from "@/lib/data";
import { formatDate } from "@/lib/utils";
import {
  canManageBills,
  canViewAnalytics,
  canViewFinancialTotals,
} from "@/lib/permissions";
import type { SessionUser } from "@/lib/auth";
import Total from "./total";
import EditButton from "./EditButton";

const ContactTable = async ({
  query,
  date,
  session,
}: {
  query: string;
  date: string;
  session: SessionUser;
}) => {
  const contacts = await getBills(query, date);
  const showTotals = canViewFinancialTotals(session.role);
  const showAnalytics = canViewAnalytics(session.role);
  const canManage = canManageBills(session.role);
  const showCreator = showTotals;

  const totalMonth = showTotals ? await getTotalMonth() : 0;
  const totalDate = showTotals ? await getTotalDate(date || undefined) : 0;
  const totalByDateOfMonth = showTotals ? await getTotalByDayOfMonth() : [];
  const totalBill = contacts.length;

  return (
    <>
      <Total
        showTotals={showTotals}
        showAnalytics={showAnalytics}
        totalMonth={totalMonth || 0}
        totalByDateOfMonth={totalByDateOfMonth || []}
        totalDate={totalDate || 0}
        totalBill={totalBill}
      />
      <table className="w-full m-auto border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r bg-pink-400 text-white text-sm uppercase">
          <tr className="text-xs md:text-lg">
            <th className="px-1 py-4 lg:px-6"></th>
            <th className="px-1 py-4 lg:px-6">#</th>
            <th className="px-1 py-4 lg:px-6">Name</th>
            <th className="px-1 py-4 lg:px-6">Total</th>
            <th className="px-1 py-4 lg:px-6">Note</th>
            {showCreator && (
              <th className="px-1 py-4 lg:px-6">Người tạo</th>
            )}
            <th className="px-1 py-4 lg:px-6">Created</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm bg-white">
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              className="border-b transition-all duration-200 hover:bg-gray-100"
            >
              <td className="px-0 pl-1">
                <EditButton id={contact.id.toString()} canManage={canManage} />
              </td>
              <td className="px-1 py-4 lg:px-6 text-pink-600 text-center">
                {contact.id}
              </td>
              <td className="px-1 py-4 lg:px-6 font-semibold text-center">
                {contact.customer.name}
              </td>
              <td className="px-1 py-4 lg:px-6 text-blue-600 font-bold text-center">
                {contact.amount.toLocaleString("en-US")}
              </td>
              <td className="px-1 py-4 lg:px-6 italic text-center">
                {contact.note || "—"}
              </td>
              {showCreator && (
                <td className="px-1 py-4 lg:px-6 text-center text-gray-600">
                  {contact.createdBy?.name ?? "—"}
                </td>
              )}
              <td className="px-1 py-4 lg:px-6 text-gray-500 text-right">
                {formatDate(contact.dateCreated)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ContactTable;
