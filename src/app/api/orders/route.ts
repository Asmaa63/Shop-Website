import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Order, OrderItem } from '@/types/index.d';
import { getServerSession } from 'next-auth'; 
import { ObjectId } from 'mongodb'; // Import ObjectId for potential future use or type hinting

// POST /api/orders - Creates a new order
export async function POST(request: NextRequest) {
  
  // You need to import and configure your next-auth options correctly
  // const session = await getServerSession(authOptions); 
  // if (!session || !session.user || !session.user.id) {
  //   return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  // }
  // const userId = session.user.id; 
  
  // NOTE: Mocking userId for now
  const userId = 'MOCK_USER_ID'; 

  try {
    const client = await clientPromise;
    const db = client.db('ecommerceDB');
    const collection = db.collection<Order>('orders');

    const body = await request.json();
    
    // 1. Construct the new Order document WITHOUT _id
    const newOrder = {
      userId: userId,
      items: body.items as OrderItem[],
      shippingAddress: body.shippingAddress,
      totalAmount: body.totalAmount,
      paymentMethod: body.paymentMethod,
      status: 'processing',
      createdAt: new Date(),
    };

    // 2. Insert the order into the database
    // The MongoDB driver correctly infers the type of the inserted document
    const result = await collection.insertOne(newOrder as Order); 

    return NextResponse.json(
      { 
        message: 'Order created successfully', 
        orderId: result.insertedId.toString()
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  }
}