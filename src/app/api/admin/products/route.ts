import { NextResponse } from "next/server";

const demoProducts = [
  { id: "1", name: "Classic Shirt", price: 120.0, stock: 24 },
  { id: "2", name: "Wireless Headphones", price: 560.0, stock: 12 },
];

export async function GET() {
  return NextResponse.json({ products: demoProducts });
}

export async function POST(request: Request) {
  const body = await request.json();
  // implement creation logic or mock
  return NextResponse.json({ ok: true, product: body });
}
