import CreateForm from "@/components/create-form";
import BackToContacts from "@/components/back-to-contacts";
import { getBillById, getCustomers } from "@/lib/data";
import { requireSession } from "@/lib/auth";
import { canEditBill, canEditBillNoteOnly } from "@/lib/permissions";
import { redirect } from "next/navigation";

const CreateContactPage = async ({
  searchParams,
}: {
  params: { [key: string]: string };
  searchParams: { [key: string]: string };
}) => {
  const session = await requireSession();
  const customers = await getCustomers("");
  const bill = await getBillById(parseInt(searchParams.id || "0"));

  if (bill && !canEditBill(session.role)) {
    redirect("/contacts");
  }

  const noteOnly = Boolean(bill && canEditBillNoteOnly(session.role));

  return (
    <div className="max-w-md mx-auto mt-5 p-2">
      <BackToContacts />
      <h1 className="text-2xl text-center mb-2">
        {bill ? (noteOnly ? "Sửa ghi chú" : "Edit Bill") : "Add New Bill"}
      </h1>
      <CreateForm customers={customers} bill={searchParams && bill} noteOnly={noteOnly} />
    </div>
  );
};

export default CreateContactPage;
