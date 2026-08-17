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

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
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
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function copyMessageAndQr(amount: number, qrSrc: string) {
  const qr = new Image();
  qr.src = qrSrc;
  await qr.decode();

  const width = 640;
  const padding = 36;
  const inner = 20;
  const contentW = width - (padding + inner) * 2;
  const qrW = contentW;
  const qrH = qr.naturalHeight * (qrW / qr.naturalWidth);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");

  const titleFont = "700 24px sans-serif";
  const amountFont = "700 36px sans-serif";
  const noteFont = "500 18px sans-serif";
  const shopFont = "700 18px sans-serif";

  ctx.font = titleFont;
  const titleLines = wrapText(ctx, BILL_COMPLETE_TITLE, contentW);
  ctx.font = noteFont;
  const noteLines = wrapText(ctx, BILL_COMPLETE_NOTE, contentW);

  const titleH = titleLines.length * 32;
  const noteH = noteLines.length * 26;
  const height =
    padding +
    inner +
    titleH +
    16 +
    44 +
    16 +
    qrH +
    20 +
    noteH +
    18 +
    24 +
    inner +
    padding;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  roundRect(ctx, 12, 12, width - 24, height - 24, 28);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#f9a8d4";
  ctx.lineWidth = 4;
  ctx.stroke();

  let y = padding + inner;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  ctx.fillStyle = "#9d174d";
  ctx.font = titleFont;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, width / 2, y + i * 32);
  });
  y += titleH + 16;

  ctx.fillStyle = "#db2777";
  ctx.font = amountFont;
  ctx.fillText(formatBillAmount(amount), width / 2, y);
  y += 52;

  ctx.drawImage(qr, (width - qrW) / 2, y, qrW, qrH);
  y += qrH + 20;

  ctx.fillStyle = "#6b7280";
  ctx.font = noteFont;
  noteLines.forEach((line, i) => {
    ctx.fillText(line, width / 2, y + i * 26);
  });
  y += noteH + 18;

  ctx.fillStyle = "#9d174d";
  ctx.font = shopFont;
  ctx.fillText("Tiệm Giặt Sấy Nhà Uyên", width / 2, y);

  const pngBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob"))),
      "image/png"
    );
  });

  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": pngBlob }),
  ]);
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
  const qrSrc = amount > 0 ? `/api/qr?amount=${Math.round(amount)}` : null;

  const handleCopy = async () => {
    try {
      if (qrSrc) {
        await copyMessageAndQr(amount, qrSrc);
      } else {
        await navigator.clipboard.writeText(message);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopied(false);
      }
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
          {qrSrc && (
            <img
              src={qrSrc}
              alt="QR chuyển khoản BIDV"
              className="mx-auto mt-3 w-full max-w-[280px] object-contain"
            />
          )}
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            {BILL_COMPLETE_NOTE}
          </p>
          <p className="mt-2 text-sm font-bold text-pink-800">
            Tiệm Giặt Sấy Nhà Uyên
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
