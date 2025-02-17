import {
  getBills,
  getTotalByDayOfMonth,
  getTotalDate,
  getTotalMonth,
} from "@/lib/data";
import { formatDate } from "@/lib/utils";
import Total from "./total";
import EditButton from "./EditButton";

const ContactTable = async ({
  query,
  date,
}: {
  query: string;
  date: string;
}) => {
  const contacts = await getBills(query, date);
  const totalMonth = await getTotalMonth();
  const totalDate = await getTotalDate();
  const totalByDateOfMonth = await getTotalByDayOfMonth();
  return (
    <>
      <Total
        totalMonth={totalMonth || 0}
        totalByDateOfMonth={totalByDateOfMonth || 0}
        totalDate={totalDate || 0}
      />
      <table className="w-[95%] m-auto border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        {/* Table Header */}
        <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm uppercase">
          <tr className="text-xs md:text-lg">
            <th className="px-2 py-4 lg:px-6"></th>
            <th className="px-2 py-4 lg:px-6">#</th>
            <th className="px-2 py-4 lg:px-6">Name</th>
            <th className="px-2 py-4 lg:px-6">Total</th>
            <th className="px-2 py-4 lg:px-6">Note</th>
            <th className="px-2 py-4 lg:px-6">Created</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="text-gray-700 text-sm bg-white">
          {contacts.map((contact, index) => (
            <tr
              key={contact.id}
              className="border-b transition-all duration-200 hover:bg-gray-100"
            >
              <td className="px-2 py-4 lg:px-6">
                <EditButton id={contact.id.toString()} />
              </td>
              <td className="px-2 py-4 lg:px-6">{index + 1}</td>
              <td className="px-2 py-4 lg:px-6 font-semibold">{contact.customer.name}</td>
              <td className="px-2 py-4 lg:px-6 text-blue-600 font-bold">
                {contact.amount.toLocaleString("en-US")}
              </td>
              <td className="px-2 py-4 lg:px-6 italic">{contact.note || "—"}</td>
              <td className="px-2 py-4 lg:px-6 text-gray-500">
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
