import { getBills, getTotalDate, getTotalMonth } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import Total from "./total";

const ContactTable = async ({
  query,
}: {
  query: string;
}) => {
  const contacts = await getBills(query);
  const totalMonth = await getTotalMonth()
  const totalDate = await getTotalDate()

  return (
    <>
    <Total totalMonth={totalMonth || 0} totalDate={totalDate || 0} />
      <table className="text-sm text-left text-gray-500 m-auto w-[95%]">
      <thead className="text-sm text-gray-700 uppercase bg-gray-50">
        <tr className="text-xs md:text-lg ">
          <th className="px-1 py-3 lg:px-6 ">#</th>
          <th className="px-1 py-3 lg:px-6 ">Name</th>
          <th className="px-1 py-3 lg:px-6 ">Total</th>
          <th className="px-1 py-3 lg:px-6 ">Note</th>
          <th className="px-1 py-3 lg:px-6 ">Created</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact) => (
          <tr key={contact.id} className="bg-white border-b text-xs md:text-lg">
            <td className="px-1 py-3 lg:px-6 ">{contact.id}</td>
            <td className="px-1 py-3 lg:px-6 ">{contact.customer.name}</td>
            <td className="px-1 py-3 lg:px-6">{contact.amount.toLocaleString("en-US")}</td>
            <td className="px-1 py-3 lg:px-6">{contact.note}</td>
            <td className="px-1 py-3 lg:px-6">
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
