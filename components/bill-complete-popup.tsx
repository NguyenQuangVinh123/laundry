"use client";

import { useEffect, useState } from "react";
import {
  BILL_COMPLETE_NOTE,
  BILL_COMPLETE_TITLE,
  buildBillCompleteMessage,
  formatBillAmount,
} from "@/lib/bill-message";

const STORAGE_KEY = "billCompleteAmount";

export function rememberBillAmount(amount: string) {
  sessionStorage.setItem(STORAGE_KEY, amount);
}

export default function BillCompletePopup() {
  const [amount, setAmount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw == null || raw === "") return;
    const parsed = Number(raw) * 1000;
    sessionStorage.removeItem(STORAGE_KEY);
    if (!Number.isNaN(parsed)) setAmount(parsed);
  }, []);

  if (amount == null) return null;

  const message = buildBillCompleteMessage(amount);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-[28px] border-2 border-pink-300 bg-white px-5 py-5 text-center shadow-xl">
          <p className="text-[17px] font-bold text-pink-800 leading-snug">
            {BILL_COMPLETE_TITLE}
          </p>
          <p className="mt-3 text-[28px] font-bold text-pink-500">
            {formatBillAmount(amount)}
          </p>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            {BILL_COMPLETE_NOTE}
          </p>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setAmount(null)}
            className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 rounded-xl bg-pink-500 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
          >
            {copied ? "Đã copy" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
