import ContactTable from "@/components/contact-table";
import Search from "@/components/search";
import { CreateButton } from "@/components/buttons";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/skeleton";
import { getBills } from "@/lib/data";

const Contacts = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    startDate?: string;
    endDate?: string;
  };
}) => {
  const query = `${searchParams?.query}-${searchParams?.startDate}-${searchParams?.endDate}`;
  const contacts = await getBills(searchParams as any);
  console.log(contacts, 'sfssgxcccc')
  return (
    <div className="max-w-screen-md mx-auto mt-5">
      <div className="flex items-center justify-between gap-1 mb-5 p-2">
        <Search />
        <CreateButton link="/contacts/create" />
      </div>
      <Suspense key={query} fallback={<TableSkeleton />}>
        <ContactTable contacts ={contacts} searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default Contacts;
