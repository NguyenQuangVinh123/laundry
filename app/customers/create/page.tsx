import CreateForm2 from "@/components/create-form-2";

const CreateContactPage = async () => {
  return (
    <div className="max-w-md mx-auto mt-5 p-2">
      <h1 className="text-2xl text-center mb-2">Add New Customer</h1>
      <CreateForm2 />
    </div>
  );
};

export default CreateContactPage;
