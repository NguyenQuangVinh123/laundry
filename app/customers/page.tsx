import ContactTable from "@/components/contact-table";
import Search from "@/components/search";
import { CreateButton } from "@/components/buttons";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/skeleton";
import CustomersTable from "@/components/customers-table";

const Customers = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || "";

  return (
    <div className="max-w-screen-md mx-auto mt-5">
      <div className="flex items-center justify-between gap-1 mb-5 p-2">
        <Search />
        <CreateButton />
      </div>
      <Suspense key={query} fallback={<TableSkeleton />}>
        <CustomersTable query={query}/>
      </Suspense>
    </div>
  );
};

export default Customers;
