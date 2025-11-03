import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface OrderItemInput {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  imageUrl?: string;
}

interface LeanOrder {
  _id: string | { toString(): string };
  status: string;
  totalAmount: number;
  createdAt: Date;
  items?: { name: string; quantity: number; price: number; image?: string }[];
  user?: { email?: string };
  email?: string;
}

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.email === "asmaasharf123@gmail.com";
    let orders: LeanOrder[] = [];
    
    if (isAdmin) {
      orders = (await Order.find({})
  .sort({ createdAt: -1 })
  .lean()) as unknown as LeanOrder[];
      console.log("🔍 ALL ORDERS FROM DATABASE:");
      console.log("Total orders in DB:", orders.length);
      orders.forEach((order, index) => {
        console.log(`Order ${index + 1}:`, {
          id: order._id,
          userEmail: order.user?.email || order.email || 'NO EMAIL',
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          hasItems: !!order.items,
          itemsCount: order.items?.length || 0
        });
      });
    } else {
      orders = (await Order.find({ "user.email": session.user.email })
  .sort({ createdAt: -1 })
  .lean()) as unknown as LeanOrder[];
    }

   const transformedOrders = orders.map((order) => ({
      ...order,
      id: typeof order._id === "string" ? order._id : order._id.toString(),
    }));

    console.log(`✅ Fetching orders for ${session.user.email} (Admin: ${isAdmin})`);
    console.log(`✅ Total orders returned: ${transformedOrders.length}`);

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
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
      items: items.map((item: OrderItemInput) => ({
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