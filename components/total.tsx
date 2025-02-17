"use client";
import { formatDate } from "@/lib/utils";
import React, { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function Total({
  totalMonth,
  totalDate,
  totalByDateOfMonth,
}: {
  totalMonth: number;
  totalDate: number;
  totalByDateOfMonth: any;
}) {
  const [totalMonthShow, setTotalMonth] = useState<string | number>(totalMonth);

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
      setValue(true);
      location.reload();
    }
  };

  return (
    <>
      <div>
        {
          !value && <button
            onClick={(e) => showAllAdmin(e)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            Admin Checking
          </button>
        }

      </div>
      {value && (
        <>
          <div className="flex gap-2">
            <div>
              Total Date:{" "}
              <span className="text-xl font-bold text-red-500">
                {totalDateShow}
              </span>
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
              <span className="text-lg font-semibold">Money each day in Month</span>
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Collapsible Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1000px] opacity-100 p-4" : "max-h-0 opacity-0 p-0"
                } bg-white rounded-b-xl`}
            >
              {totalByDateOfMonthS.map((i: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between py-3 border-b last:border-none text-gray-700"
                >
                  <div className="flex-1 font-medium">{formatDate(i.date)}</div>
                  <div className="flex-1 text-right font-semibold text-blue-600">{i.total}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
