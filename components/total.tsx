"use client";
import React, { useState } from "react";

export default function Total({
  totalMonth,
  totalDate,
}: {
  totalMonth: number;
  totalDate: number;
}) {
  const [totalMonthShow, setTotalMonth] = useState<string | number>("********");
  const [isActiveDate, setIsActiveDate] = useState(false);
  const [isActiveMonth, setIsActiveMonth] = useState(false);

  const [totalDateShow, setTotalDateMonth] = useState<string | number>(
    "********"
  );

  const showBill = (e: any) => {
    if (!isActiveDate) {
      e.stopPropagation();
      let person = prompt("Please enter password");
      if (person && parseInt(person) === 12344321) {
        setTotalDateMonth(totalDate);
        setIsActiveDate(true);
      }
    }
  };
  const showBillMonth = async (e: any) => {
    if (!isActiveMonth) {
      e.stopPropagation();
      let person = prompt("Please enter password");
      if (person && parseInt(person) === 12344321) {
        setTotalMonth(totalMonth);
        setIsActiveMonth(true);
      }
    }
  };
  return (
    <>
      <div>
        Total Date:
        <span
          style={{ fontSize: "20px", fontWeight: "bold", cursor: "pointer" }}
          onClick={(e) => showBill(e)}
        >
          {totalDateShow}
        </span>
      </div>
      <div>
        Total Month:
        <span
          style={{ fontSize: "20px", fontWeight: "bold", cursor: "pointer" }}
          onClick={(e) => showBillMonth(e)}
        >
          {totalMonthShow}
        </span>
      </div>
    </>
  );
}
