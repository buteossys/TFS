import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.soar-commerce.com';
const API_KEY = process.env.SOAR_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Forward to headless backend
    const response = await fetch(`${API_BASE_URL}/api/v1/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY || '',
      },
      body: JSON.stringify({
        to: ['thefairshoppe@gmail.com'],
        subject: `New Contact Form Submission from ${name}`,
        body: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html_body: `<h2>New Contact Form Submission</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}