import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://soar-api-2pmz2r36bq-uc.a.run.app/api/v1';
const API_KEY = process.env.SOAR_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Normalize API_BASE_URL - remove trailing slash and ensure it ends with /api/v1
    let baseUrl = API_BASE_URL.trim().replace(/\/+$/, ''); // Remove trailing slashes
    if (!baseUrl.endsWith('/api/v1')) {
      // If it doesn't end with /api/v1, add it
      baseUrl = baseUrl.endsWith('/api') ? `${baseUrl}/v1` : `${baseUrl}/api/v1`;
    }
    
    // Construct full URL - ensure no double slashes
    const productsPath = '/products';
    const fullUrl = `${baseUrl}${productsPath}${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching products from:', fullUrl);
    console.log('API_BASE_URL (env):', process.env.NEXT_PUBLIC_API_URL);
    console.log('API_BASE_URL (resolved):', API_BASE_URL);
    console.log('Normalized baseUrl:', baseUrl);
    console.log('API_KEY present:', !!API_KEY);
    console.log('API_KEY length:', API_KEY?.length || 0);
    
    // Check if API key is missing
    if (!API_KEY) {
      console.error('WARNING: SOAR_API_KEY is not set in environment variables!');
      console.error('Make sure SOAR_API_KEY is in your .env.local file');
    }
    
    const response = await fetch(fullUrl, {
      headers: {
        'X-API-Key': API_KEY || '',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', response.status, errorText);
      console.error('Requested URL:', fullUrl);
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const products = await response.json();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/products`, {
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