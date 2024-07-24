import { getBills } from "@/lib/data";
import { formatDate } from "@/lib/utils";

const ContactTable = async ({
  query,
}: {
  query: string;
}) => {
  const contacts = await getBills(query);
  console.log(contacts, 'ssss')

  return (
    <table className="text-sm text-left text-gray-500 m-auto w-[95%]">
      <thead className="text-sm text-gray-700 uppercase bg-gray-50">
        <tr className="text-xs md:text-lg ">
          <th className="px-1 py-3 lg:px-6 ">#</th>
          <th className="px-1 py-3 lg:px-6 ">Name</th>
          <th className="px-1 py-3 lg:px-6 ">Total</th>
          <th className="px-1 py-3 lg:px-6 ">Created At</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact) => (
          <tr key={contact.id} className="bg-white border-b text-xs md:text-lg">
            <td className="px-1 py-3 lg:px-6 ">{contact.id}</td>
            <td className="px-1 py-3 lg:px-6 ">{contact.customer.name}</td>
            <td className="px-1 py-3 lg:px-6">{contact.amount.toLocaleString("en-US")} VND</td>
            <td className="px-1 py-3 lg:px-6">
              {formatDate(contact.dateCreated)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactTable;
