import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose"; 
import { Wishlist } from "@/models/Wishlist";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}


export async function GET(req: Request) {
  await connectDB();
  const userId = req.headers.get("user-id");
  const wishlist = await Wishlist.findOne({ userId });
  return NextResponse.json(wishlist || { items: [] });
}

export async function POST(req: Request) {
  await connectDB();
  const { userId, product } = await req.json();

  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) wishlist = new Wishlist({ userId, items: [] });

  wishlist.items.push(product);
  await wishlist.save();

  return NextResponse.json(wishlist);
}

export async function DELETE(req: Request) {
  await connectDB();
  const { userId, productId } = await req.json();
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) return NextResponse.json({ message: "Not found" }, { status: 404 });

  wishlist.items = wishlist.items.filter((p: WishlistItem) => p.id !== productId);
  await wishlist.save();

  return NextResponse.json(wishlist);
}
