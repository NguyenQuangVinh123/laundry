import Search from "@/components/search";
import { CreateButton } from "@/components/buttons";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/skeleton";
import ContactTable from "@/components/contact-table";
import BillCompletePopup from "@/components/bill-complete-popup";
import { requireSession } from "@/lib/auth";
import { cookies } from "next/headers";

const Contacts = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    date?: string;
  };
}) => {
  const session = await requireSession();
  const query = searchParams?.query || "";
  const date = searchParams?.date || "";
  const lastBillId = cookies().get("lastBillId")?.value ?? null;
  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="flex items-center justify-between gap-2 p-2 max-w-sm m-auto">
        <Search />
        <CreateButton link="/contacts/create" />
      </div>
      <Suspense key={`${query}-${date}`} fallback={<TableSkeleton />}>
        <ContactTable query={query} date={date} session={session} />
      </Suspense>
      <BillCompletePopup billId={lastBillId} />
    </div>
  );
};

export default Contacts;
