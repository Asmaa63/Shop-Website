import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  console.log("Received new product data:", data);

  // هنا ممكن مستقبلاً تحفظي فعلاً في قاعدة بيانات أو JSON على السيرفر
  return NextResponse.json({ success: true });
}
