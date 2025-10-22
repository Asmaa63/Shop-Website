import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = params;
    const { status } = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ message: "Error updating order" }, { status: 500 });
  }
}
