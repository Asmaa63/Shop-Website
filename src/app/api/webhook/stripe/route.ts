import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import stripe from '@/lib/stripe';
import clientPromise from '@/lib/mongodb';
import { Order, OrderItem, ShippingAddress } from '@/types/index.d';
import { ObjectId } from 'mongodb';

// Configuration to prevent Next.js from parsing the body automatically
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  // 1. Get the raw body as a Buffer for signature verification
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  // 2. Verify the Stripe event signature
  try {
    if (!signature || !webhookSecret) {
        throw new Error('Missing Stripe signature or Webhook secret');
    }
    
    // Stripe.webhooks.constructEvent expects Buffer, so we convert the text body
    event = stripe.webhooks.constructEvent(
      Buffer.from(body), 
      signature, 
      webhookSecret
    );
  } catch (err: unknown) { // FIX 1: Changed 'any' to 'unknown'
    let errorMessage = 'Unknown webhook error';
    
    // FIX 2: Type assertion to safely access the error message property
    if (err instanceof Error) {
        errorMessage = err.message;
    } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = (err as { message: string }).message;
    }
    
    console.error(`Webhook signature verification failed: EGP{errorMessage}`);
    return new NextResponse(`Webhook Error: EGP{errorMessage}`, { status: 400 });
  }

  // 3. Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    if (!session.metadata || !session.metadata.shipping_address) {
        console.error('Missing required metadata in session.');
        return new NextResponse('Missing metadata', { status: 400 });
    }

    try {
      const client = await clientPromise;
      const db = client.db('ecommerceDB');
      const orderCollection = db.collection<Order>('orders');
      
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

      const shippingAddress: ShippingAddress = JSON.parse(session.metadata.shipping_address);
      const mockUserId = 'MOCK_USER_ID_FROM_SESSION';

      // 4. Construct the Order
      const items: OrderItem[] = lineItems.data.map(item => ({
        productId: item.price?.product?.toString() || new ObjectId().toHexString(),
        name: item.description || 'Unknown Product',
        price: (item.price?.unit_amount || 0) / 100,
        quantity: item.quantity || 1,
        imageUrl: 'PLACEHOLDER_URL',
      }));

      const totalAmount = (session.amount_total || 0) / 100;

      const newOrder = {
        userId: mockUserId,
        items: items,
        shippingAddress: shippingAddress,
        totalAmount: totalAmount,
        paymentMethod: session.payment_method_types[0] || 'Stripe',
        status: 'delivered', 
        createdAt: new Date(),
      };

      // 5. Save the Order to MongoDB
      await orderCollection.insertOne(newOrder as Order);
      
      console.log(`Order created successfully for session: EGP{session.id}`);

    } catch (dbError) {
      console.error('Database Error during order creation:', dbError);
      return new NextResponse('Database Error', { status: 500 });
    }
  }

  return new NextResponse('Event received', { status: 200 });
}