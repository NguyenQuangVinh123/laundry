import { getBills } from "@/lib/data";
import { formatDate } from "@/lib/utils";

const ContactTable = async ({
  query,
}: {
  query: string;
}) => {
  const contacts = await getBills(query);

  return (
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-sm text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="py-3 px-6">#</th>
          <th className="py-3 px-6">Name Customer</th>
          <th className="py-3 px-6">Total</th>
          <th className="py-3 px-6">Created At</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact) => (
          <tr key={contact.id} className="bg-white border-b">
            <td className="py-3 px-6">{contact.id}</td>
            <td className="py-3 px-6">{contact.customer.name}</td>
            <td className="py-3 px-6">{contact.amount.toLocaleString("en-US")} VND</td>
            <td className="py-3 px-6">
              {formatDate(contact.dateCreated.toString())}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactTable;
