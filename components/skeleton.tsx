export const TableSkeleton = () => {
  return (
    <table className="m-auto text-sm text-left text-gray-500 p-2">
      <thead className="text-sm text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="py-3 px-6"></th>
          <th className="py-3 px-6">#</th>
          <th className="py-3 px-6">Name</th>
          <th className="py-3 px-6">Total</th>
          <th className="py-3 px-6">Note</th>
          <th className="py-3 px-6">Created</th>
        </tr>
      </thead>
      <tbody className="animate-pulse">
        {[...Array(6)].map((_, index) => (
          <tr key={index} className="bg-white border-b border-gray-50">
            <td className="py-3 px-6">
              <div className="h-4 w-4 rounded bg-gray-100"></div>
            </td>
            <td className="py-3 px-6">
              <div className="h-4 w-4 rounded bg-gray-100"></div>
            </td>
            <td className="py-3 px-6">
              <div className="h-4 w-32 rounded bg-gray-100"></div>
            </td>
            <td className="py-3 px-6">
              <div className="h-4 w-20 rounded bg-gray-100"></div>
            </td>
            <td className="py-3 px-6">
              <div className="h-4 w-32 rounded bg-gray-100"></div>
            </td>
            <td className="py-3 px-6">
              <div className="h-4 w-32 rounded bg-gray-100"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
