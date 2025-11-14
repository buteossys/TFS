import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.soar-commerce.com';
const API_KEY = process.env.SOAR_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${params.id}`, {
      headers: {
        'X-API-Key': API_KEY || '',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    const product = await response.json();
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${params.id}`, {
      method: 'PUT',
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
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${params.id}`, {
      method: 'DELETE',
      headers: {
        'X-API-Key': API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}