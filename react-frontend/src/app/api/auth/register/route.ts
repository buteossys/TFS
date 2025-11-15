import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://soar-api-2pmz2r36bq-uc.a.run.app/api/v1';
const API_KEY = process.env.SOAR_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY || '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Registration failed' }));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const user = await response.json();
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}