import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://soar-api-2pmz2r36bq-uc.a.run.app/api/v1';
const API_KEY = process.env.SOAR_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, userId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Forward to headless backend
    const response = await fetch(`${API_BASE_URL}/payments/create-payment-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY || '',
      },
      body: JSON.stringify({
        order_id: `order_${Date.now()}_${userId || 'guest'}`,
        line_items: items.map((item: any) => ({
          price: Math.round((item.price || 0) * 100), // Convert to cents
          quantity: item.quantity
        })),
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart`
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 