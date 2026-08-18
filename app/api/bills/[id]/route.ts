import { NextRequest, NextResponse } from "next/server";
import { getBillById } from "@/lib/data";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid bill id" }, { status: 400 });
  }

  const bill = await getBillById(id);
  if (!bill) {
    return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  }

  return NextResponse.json(bill);
}
