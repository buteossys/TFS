import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.soar-commerce.com';
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
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/create-payment-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY || '',
      },
      body: JSON.stringify({
        line_items: items.map((item: any) => ({
          name: item.title || item.name,
          quantity: String(item.quantity),
          base_price_money: {
            amount: Math.round((item.price || 0) * 100), // Convert to cents
            currency: 'USD'
          }
        })),
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart`,
        order_id: `order_${Date.now()}_${userId || 'guest'}`
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