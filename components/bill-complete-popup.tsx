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

/** Dispatch from anywhere to re-open the popup for a specific bill */
export function showBillPopup(billId: string) {
  window.dispatchEvent(new CustomEvent("show-bill-popup", { detail: { billId } }));
}

/* ── Component ── */

export default function BillCompletePopup({ billId: initialBillId }: { billId: string | null }) {
  const [amount, setAmount] = useState<number | null>(null);
  const [activeBillId, setActiveBillId] = useState<string | null>(initialBillId);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // auto-open after creating a new bill
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw != null && raw !== "") {
      const parsed = Number(raw) * 1000;
      sessionStorage.removeItem(STORAGE_KEY);
      if (!Number.isNaN(parsed)) {
        setAmount(parsed);
        setActiveBillId(initialBillId);
      }
    }

    // listen for re-open events
    const handler = async (e: Event) => {
      const { billId } = (e as CustomEvent).detail as { billId: string };
      try {
        const res = await fetch(`/api/bills/${billId}`);
        if (!res.ok) return;
        const bill = await res.json();
        setActiveBillId(String(bill.id));
        setAmount(bill.amount * 1000);
      } catch {
        // silently ignore
      }
    };
    window.addEventListener("show-bill-popup", handler);
    return () => window.removeEventListener("show-bill-popup", handler);
  }, [initialBillId]);

  if (amount == null) return null;

  const currentBillId = activeBillId;
  const message = buildBillCompleteMessage(amount, currentBillId);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
      return;
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-[28px] border-2 border-pink-300 bg-white px-5 py-5 text-center shadow-xl">
          <p className="text-[17px] font-bold text-pink-800 leading-snug">
            {BILL_COMPLETE_TITLE}
          </p>
          {currentBillId && (
            <p className="mt-1 text-sm text-gray-400">
              Mã đơn: <span className="font-semibold text-gray-600">#{currentBillId}</span>
            </p>
          )}
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
            onClick={() => { setAmount(null); setCopied(false); }}
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
