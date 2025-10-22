import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  imageUrl?: string;
}


// GET - جلب كل الطلبات
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST - حفظ طلب جديد ✅
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId, items, shippingAddress, totalAmount, status } = body;

    // التحقق من البيانات الأساسية
    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "Items are required" },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { message: "Shipping address is required" },
        { status: 400 }
      );
    }

    // إنشاء الطلب في قاعدة البيانات
    const newOrder = await Order.create({
      userId: userId || "guest",
      items: items.map((item: OrderItem) => ({
  name: item.name,
  quantity: item.quantity,
  price: item.price,
  image: item.imageUrl || item.image,
})),
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
      },
      totalAmount,
      status: status || "Pending",
    });

    return NextResponse.json(
      { 
        message: "Order created successfully",
        orderId: newOrder._id,
        order: newOrder 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Error creating order:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}