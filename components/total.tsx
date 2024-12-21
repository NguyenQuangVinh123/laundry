"use client";
import { formatDate } from "@/lib/utils";
import React, { useState } from "react";

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
  let showAll: any = false;

  if (typeof window !== "undefined" && localStorage) {
    showAll = localStorage.getItem("isAdmin");
  }
  const showAllAdmin = (e: any) => {
    e.stopPropagation();
    let person = prompt("Please enter password");
    if (person && parseInt(person) === 12344321) {
      setTotalByDateOfMonthS(totalByDateOfMonth);
      setTotalMonth(totalMonth);
      setTotalDateMonth(totalDate);
      localStorage.setItem("isAdmin", "1");
      location.reload();
    }
  };

  return (
    <>
      <div>
        <button
          onClick={(e) => showAllAdmin(e)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          Admin Checking
        </button>
      </div>
      {showAll && (
        <>
          <div className="flex gap-2">
            <div>
              Total Date:{" "}
              <span className="text-xl font-bold cursor-pointer">
                {totalDateShow}
              </span>
            </div>
            <div>
              Total Month:{" "}
              <span className="text-xl font-bold cursor-pointer">
                {totalMonthShow}
              </span>
            </div>
          </div>

          <div>
            Money each day in Month
            {totalByDateOfMonthS.map((i: any, index: number) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  padding: "8px 0",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <div style={{ flex: 1 }}>{formatDate(i.date)}</div>
                <div style={{ flex: 1 }}>{i.total}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
