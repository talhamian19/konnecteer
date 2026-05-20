import { NextResponse } from "next/server";
// V1 legacy — replaced by /api/events in V2
export async function GET() {
  return NextResponse.json([]);
}
