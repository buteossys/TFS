import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.soar-commerce.com';
const API_KEY = process.env.SOAR_API_KEY;

export async function POST() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY || '',
      },
      body: JSON.stringify({
        to: ['thefairshoppe@gmail.com'],
        subject: 'Test Email from Fair Shoppe',
        body: 'This is a test email to verify the email configuration is working correctly.',
        html_body: '<p>This is a test email to verify the email configuration is working correctly.</p>'
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send test email',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}