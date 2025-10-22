import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://68f0b6520b966ad50033e04c.mockapi.io/ecommerce/products";

export async function GET() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ message: "Failed to add product" }, { status: 500 });
  }
}
