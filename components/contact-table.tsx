import { getBills } from "@/lib/data";

import Table from "./table";

const ContactTable = async ({ searchParams } : {searchParams: any}) => {
  const contacts = await getBills(searchParams);

  return <Table contacts={contacts} searchParam={searchParams} />;
};

export default ContactTable;
