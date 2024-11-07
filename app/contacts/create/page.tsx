import CreateForm from "@/components/create-form";
import { getBillById, getCustomers } from "@/lib/data";

const CreateContactPage = async ({
  params,
  searchParams,
}: {
  params: { [key: string]: string };
  searchParams: { [key: string]: string };
}) => {
  const customers = await getCustomers("");
  let bill;
  console.log(searchParams, 'searchParams')
  if (searchParams && Object.keys(searchParams).length > 0) {
    bill = await getBillById(parseInt(searchParams.id));
  }
  return (
    <div className="max-w-md mx-auto mt-5 p-2">
      <h1 className="text-2xl text-center mb-2">{bill && bill ? "Edit" : "Add New"} Bill</h1>
      <CreateForm customers={customers} bill={bill && bill} />
    </div>
  );
};

export default CreateContactPage;
