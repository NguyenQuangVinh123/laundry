import ContactTable from "@/components/contact-table";
import Search from "@/components/search";
import { CreateButton } from "@/components/buttons";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/skeleton";

const Contacts = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) => {
  const query = searchParams?.query || "";

  return (
    <div className="max-w-screen-lg mx-auto mt-5">
      <div className="flex items-center justify-between gap-2 mb-5 p-2 max-w-sm m-auto">
        <Search />
        <CreateButton link="/contacts/create" />
      </div>
      <Suspense key={query} fallback={<TableSkeleton />}>
        <ContactTable query={query}/>
      </Suspense>
    </div>
  );
};

export default Contacts;
