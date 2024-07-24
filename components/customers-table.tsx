import { getBills, getCustomers } from "@/lib/data";
import { formatDate } from "@/lib/utils";

const CustomersTable = async ({ query }: { query: string }) => {
  const contacts = await getCustomers(query);
  console.log(contacts, "contacts");
  return (
    <table className="text-sm text-left text-gray-500 m-auto w-[95%]">
      <thead className="text-sm text-gray-700 uppercase bg-gray-50">
        <tr className="text-xs md:text-lg ">
          <th className="px-1 py-3 lg:px-6 ">Name</th>
          <th className="px-1 py-3 lg:px-6 ">Total Used</th>
          <th className="px-1 py-3 lg:px-6 ">Date Used</th>

          <th className="px-1 py-3 lg:px-6 ">Phone</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact) => (
          <tr key={contact.id} className="bg-white border-b text-xs md:text-lg">
            <td className="px-1 py-3 lg:px-6 ">{contact.name}</td>
            <td className="px-1 py-3 lg:px-6">{contact.totalUsed}</td>
            <td className="px-1 py-3 lg:px-6">
              {contact.dateUsed.map((i) => (
                <div key={i} className="whitespace-nowrap">{formatDate(i.toString())}</div>
              ))}
            </td>

            <td className="px-1 py-3 lg:px-6">{contact.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomersTable;
