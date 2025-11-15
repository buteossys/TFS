import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://soar-api-2pmz2r36bq-uc.a.run.app/api/v1';
const API_KEY = process.env.SOAR_API_KEY;

// This webhook is now handled by headless backend
export async function POST(request: Request) {
  try {
    const body = await request.text();
    
    // Forward webhook to headless backend
    // Note: Webhook endpoints may not require API key, but including it for consistency
    const response = await fetch(`${API_BASE_URL}/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY || '',
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}