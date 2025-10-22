import { NextResponse } from "next/server";

// GET single product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(
      `https://68f0b6520b966ad50033e04c.mockapi.io/ecommerce/products/${params.id}`
    );
    if (!res.ok) throw new Error("Product not found");
    const product = await res.json();
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// UPDATE product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const res = await fetch(
      `https://68f0b6520b966ad50033e04c.mockapi.io/ecommerce/products/${params.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) throw new Error("Failed to update");
    const updated = await res.json();
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(
      `https://68f0b6520b966ad50033e04c.mockapi.io/ecommerce/products/${params.id}`,
      { method: "DELETE" }
    );
    if (!res.ok) throw new Error("Failed to delete");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}