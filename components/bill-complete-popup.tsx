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

/* ── Canvas helpers ── */

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function renderCanvas(amount: number) {
  const width = 640;
  const padding = 48;
  const borderW = 4;
  const contentW = width - padding * 2;

  const titleFont = "700 28px sans-serif";
  const amountFont = "700 44px sans-serif";
  const noteFont = "500 20px sans-serif";

  /* measure heights */
  const tmp = document.createElement("canvas").getContext("2d")!;
  tmp.font = titleFont;
  const titleLines = wrapText(tmp, BILL_COMPLETE_TITLE, contentW);
  tmp.font = noteFont;
  const noteLines = wrapText(tmp, BILL_COMPLETE_NOTE, contentW);

  const titleH = titleLines.length * 38;
  const amountH = 52;
  const noteH = noteLines.length * 30;
  const gap = 20;
  const height = padding + titleH + gap + amountH + gap + noteH + padding;

  /* draw */
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  roundRect(ctx, borderW / 2, borderW / 2, width - borderW, height - borderW, 28);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#f9a8d4";
  ctx.lineWidth = borderW;
  ctx.stroke();

  let y = padding;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  ctx.fillStyle = "#9d174d";
  ctx.font = titleFont;
  titleLines.forEach((line, i) => ctx.fillText(line, width / 2, y + i * 38));
  y += titleH + gap;

  ctx.fillStyle = "#ec4899";
  ctx.font = amountFont;
  ctx.fillText(formatBillAmount(amount), width / 2, y);
  y += amountH + gap;

  ctx.fillStyle = "#6b7280";
  ctx.font = noteFont;
  noteLines.forEach((line, i) => ctx.fillText(line, width / 2, y + i * 30));

  return canvas;
}

function downloadImage(amount: number) {
  const canvas = renderCanvas(amount);
  const link = document.createElement("a");
  link.download = `don-hang-${formatBillAmount(amount).replace(/\s/g, "")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* ── Component ── */

export default function BillCompletePopup({ billId }: { billId: string | null }) {
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

  const message = buildBillCompleteMessage(amount, billId);

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
            onClick={() => downloadImage(amount)}
            className="flex-1 rounded-xl border border-pink-300 bg-white py-2.5 text-sm font-medium text-pink-600 hover:bg-pink-50"
          >
            Tải hình
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
