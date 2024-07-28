"use client";
import React, { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";

export default function Table({
  contacts,
  searchParam,
}: {
  contacts: any;
  searchParam: any;
}) {
  const tableRef = useRef(null);
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [value, onChange] = useState<any>([
    new Date(searchParams.get("startDate")?.toString() as string),
    new Date(searchParams.get("endDate")?.toString() as string),
  ]);
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("startDate", new Date(value[0]).toString());
      params.set("endDate", new Date(value[1]).toString());
      if (router) {
        router.replace(`${pathName}?${params.toString()}`);
      }
    }
  }, [value]);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Bill table",
    sheet: "Bills",
  });
  const exportExcel = () => {
    let input = prompt("Enter password");
    if (input === "gacon159") {
      onDownload();
    } else {
      return;
    }
  };

  return (
    <div className="flex gap-3 flex-col">
      <div className="w-full">
        <DateRangePicker onChange={onChange} value={value} />
      </div>
      <button
        className="text-white max-w-[150px] bg-blue-700 hover:bg-blue-800 font-medium rounded-sm text-sm px-2 py-2 text-center"
        onClick={exportExcel}
      >
        Export excel
      </button>
      <table
        ref={tableRef}
        className="text-sm text-left text-gray-500 m-auto w-[95%]"
      >
        <thead className="text-sm text-gray-700 uppercase bg-gray-50">
          <tr className="text-xs md:text-lg">
            <th className="px-1 py-3 lg:px-6 ">#</th>
            <th className="px-1 py-3 lg:px-6 ">Name</th>
            <th className="px-1 py-3 lg:px-6 ">Total</th>
            <th className="px-1 py-3 lg:px-6 ">Created At</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact: any) => (
            <tr
              key={contact.id}
              className="bg-white border-b text-xs md:text-lg"
            >
              <td className="px-1 py-3 lg:px-6 ">{contact.id}</td>
              <td className="px-1 py-3 lg:px-6 ">{contact.customer.name}</td>
              <td className="px-1 py-3 lg:px-6">
                {contact.amount.toLocaleString("en-US")} VND
              </td>
              <td className="px-1 py-3 lg:px-6">
                {formatDate(contact.dateCreated)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
