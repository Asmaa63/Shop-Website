import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
// FIX: Imported CartItem and ShippingAddress from the updated types file
import { CartItem, ShippingAddress } from '@/types/index.d';

// POST /api/payment - Creates a Stripe Checkout Session

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Explicitly destructure and type the received body data
    const { items, shippingAddress } = body as { 
      items: CartItem[]; 
      shippingAddress: ShippingAddress 
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Cart items are required' }, { status: 400 });
    }

    // --- 1. Prepare Line Items for Stripe ---
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd', 
        product_data: {
          name: item.name,
          images: [item.imageUrl],
          description: `Product ID: ${item._id}`, // Use _id here
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // --- 2. Calculate dynamic URLs for redirection ---
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/checkout?cancelled=true`;

    // --- 3. Create Stripe Checkout Session ---
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      
      // Pass shipping details to Stripe
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'EG'] },
      customer_email: 'customer@example.com', 
      
      // Metadata to pass data about the order to the Stripe webhook later (important!)
      metadata: {
        shipping_address: JSON.stringify(shippingAddress),
        // Add userId from NextAuth session here
      },

      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // Return the session URL to the client for redirection
    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error) {
    console.error('Stripe Session Creation Error:', error);
    return NextResponse.json(
      { message: 'Error creating checkout session' }, 
      { status: 500 }
    );
  }
}