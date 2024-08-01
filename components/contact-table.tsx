import { getBills } from "@/lib/data";

import Table from "./table";

const ContactTable = async ({
  searchParams,
  contacts,
}: {
  searchParams: any;
  contacts: any;
}) => {
  return <Table contacts={contacts} searchParam={searchParams} />;
};

export default ContactTable;
