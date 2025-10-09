import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validate required fields
    const { name, email, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send auto-reply to customer
    // 4. Log the inquiry
    
    // For now, we'll just log the contact form data
    console.log('Contact form submission:', {
      name,
      email,
      phone: body.phone || 'Not provided',
      subject,
      message,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully',
        id: `contact-${Date.now()}` // Generate a reference ID
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
