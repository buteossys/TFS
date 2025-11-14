import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.soar-commerce.com';
const API_KEY = process.env.SOAR_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/products${queryString ? `?${queryString}` : ''}`, {
      headers: {
        'X-API-Key': API_KEY || '',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const products = await response.json();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY || '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const product = await response.json();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}