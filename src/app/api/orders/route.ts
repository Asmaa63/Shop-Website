import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.email === "asmaasharf123@gmail.com";

    let orders;
    
    if (isAdmin) {
      orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    } else {
      orders = await Order.find({ "user.email": session.user.email }).sort({ createdAt: -1 }).lean();
    }

    const transformedOrders = orders.map(order => ({
      ...order,
      id: order._id.toString(),
    }));

    console.log(`Fetching orders for ${session.user.email} (Admin: ${isAdmin})`);
    console.log(`Total orders found: ${transformedOrders.length}`);

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    console.log("Session user =>", session?.user);

    const body = await request.json();
    const { items, shippingAddress, totalAmount, status } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Items are required" }, { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json({ message: "Shipping address is required" }, { status: 400 });
    }

    const newOrder = await Order.create({
      userId: session?.user?.id || "guest",
      user: {
        name: session?.user?.name || "Guest User",
        email: session?.user?.email || "guest@example.com",
      },
      items: items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.imageUrl || item.image,
      })),
      shippingAddress: {
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        governorate: shippingAddress.governorate,
        city: shippingAddress.city,
        street: shippingAddress.street,
        village: shippingAddress.village || '',
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country || 'Egypt',
      },
      totalAmount,
      status: status || "Pending",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Order created successfully", orderId: newOrder._id, order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}