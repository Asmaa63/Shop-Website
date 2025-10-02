import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { message: "This login route is managed by NextAuth CredentialsProvider." },
    { status: 200 }
  );
}
