import { NextRequest, NextResponse } from "next/server";
import { MOCK_MATCHES } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let matches = MOCK_MATCHES;

  if (status) {
    matches = matches.filter((m) => m.status === status);
  }

  return NextResponse.json({ matches });
}
