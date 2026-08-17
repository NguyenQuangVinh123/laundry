import { NextResponse } from "next/server";
import { buildVietQrUrl } from "@/lib/bill-message";

export async function GET(request: Request) {
  const amount = Number(new URL(request.url).searchParams.get("amount"));
  if (!amount || Number.isNaN(amount) || amount <= 0) {
    return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
  }

  const res = await fetch(buildVietQrUrl(amount));
  if (!res.ok) {
    return NextResponse.json({ message: "Failed to load QR" }, { status: 502 });
  }

  const image = await res.arrayBuffer();
  return new NextResponse(image, {
    headers: {
      "Content-Type": res.headers.get("content-type") || "image/png",
      "Cache-Control": "no-store",
    },
  });
}
