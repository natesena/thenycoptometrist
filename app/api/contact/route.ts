/**
 * Contact Form API Route
 * Reference: Contact Form Email Implementation Plan
 *
 * Receives contact form submissions and sends email notifications
 * to the same recipient as weekly analytics reports.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/email';

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactFormRequestBody {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json() as ContactFormRequestBody;

    // Validate required fields
    const { name, email, message } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Log submission (without PII for debugging)
    console.log('Contact form submission received:', {
      hasName: !!name,
      hasEmail: !!email,
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    });

    // Send the email
    const emailResult = await sendContactFormEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    if (!emailResult.success) {
      console.error('Contact form email failed:', emailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    console.log('Contact form email sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully',
    });

  } catch (error) {
    console.error('Contact form API error:', error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
