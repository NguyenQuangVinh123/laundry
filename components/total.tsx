"use client";
import { formatDate } from "@/lib/utils";
import React, { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Link from "next/link";

export default function Total({
  totalMonth,
  totalDate,
  totalByDateOfMonth,
  totalBill,
}: {
  totalMonth: number;
  totalDate: number;
  totalByDateOfMonth: any;
  totalBill: number;
}) {
  const [totalMonthShow, setTotalMonth] = useState<string | number>(totalMonth);
  const [totalBillShow, setTotalBill] = useState<string | number>(totalBill);
  const [totalDateShow, setTotalDateMonth] = useState<string | number>(
    totalDate
  );
  const [totalByDateOfMonthS, setTotalByDateOfMonthS] =
    useState<any>(totalByDateOfMonth);
  const [value, setValue, removeValue] = useLocalStorage("isAdmin", false);
  const [isOpen, setIsOpen] = useState(false);
  const showAllAdmin = (e: any) => {
    e.stopPropagation();
    let person = prompt("Please enter password");
    if (person && parseInt(person) === 12344321) {
      setTotalByDateOfMonthS(totalByDateOfMonth);
      setTotalMonth(totalMonth);
      setTotalDateMonth(totalDate);
      setTotalBill(totalBill);
      setValue(true);
      location.reload();
    }
  };

  return (
    <>
      {!value && (
        <div className="flex justify-between items-center mb-4">
          <div>
            <button
              onClick={(e) => showAllAdmin(e)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              Admin Checking
            </button>
          </div>
        </div>
      )}

      {value && (
        <>
          <Link
            href="/analytics"
            className="max-w-[130px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
            Analytics
          </Link>
          <div className="flex gap-1 flex-col">
            <div className="flex gap-2">
              <div>
              Total Date:{" "}
              <span className="text-xl font-bold text-red-500">
                {totalDateShow}
              </span>
              </div>
             <div>
              Total Bill:{" "}
              <span className="text-xl font-bold text-red-500">
                {totalBillShow}
              </span>
             </div>
            </div>
            <div>
              Total Month:{" "}
              <span className="text-xl font-bold text-red-500">
                {totalMonthShow}
              </span>
            </div>
          </div>

          <div className="border border-gray-300 rounded-xl mb-2">
            <div
              className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white cursor-pointer flex justify-between items-center rounded-t-xl transition-all duration-300 hover:opacity-90"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="text-lg font-semibold">
                Money each day in Month
              </span>
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Collapsible Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-max opacity-100 p-4" : "max-h-0 opacity-0 p-0"
              } bg-white rounded-b-xl`}
            >
              {totalByDateOfMonthS.map((i: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between py-3 border-b last:border-none text-gray-700"
                >
                  <div className="flex-1 font-medium">{formatDate(i.date)}</div>
                  <div className="flex-1 text-right font-semibold text-blue-600">
                    {i.total} <span className=" text-red-400">({i.totalBill} bills)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
