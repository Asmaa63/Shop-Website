import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("ecommerce"); // ✅統一 هنا
  const orders = await db
    .collection("orders")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(orders);
}
