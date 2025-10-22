import { NextResponse } from "next/server";

export async function GET() {
  // Temporary stub - replace with real session check
  // Return { admin: true } to allow access
  return NextResponse.json({ admin: true });
}
