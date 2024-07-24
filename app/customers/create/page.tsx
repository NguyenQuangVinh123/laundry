import CreateForm from "@/components/create-form";
import { getCustomers } from "@/lib/data";

const CreateContactPage = async () => {
  const customers = await getCustomers("");
  
  return (
    <div className="max-w-md mx-auto mt-5 p-2">
      <h1 className="text-2xl text-center mb-2">Add New Bill</h1>
      <CreateForm customers={customers} />
    </div>
  );
};

export default CreateContactPage;
