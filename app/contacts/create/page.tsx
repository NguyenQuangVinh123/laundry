import CreateForm from "@/components/create-form";
import { getBillById, getCustomers } from "@/lib/data";

const CreateContactPage = async ({
  searchParams,
}: {
  params: { [key: string]: string };
  searchParams: { [key: string]: string };
}) => {
  const customers = await getCustomers("");
  const bill = await getBillById(parseInt(searchParams.id || "0"));
  return (
    <div className="max-w-md mx-auto mt-5 p-2">
      <h1 className="text-2xl text-center mb-2">{searchParams && bill ? "Edit" : "Add New"} Bill</h1>
      <CreateForm customers={customers} bill={searchParams && bill} />
    </div>
  );
};

export default CreateContactPage;
