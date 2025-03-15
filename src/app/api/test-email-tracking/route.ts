import { NextRequest, NextResponse } from 'next/server';

/**
 * GET handler for testing email tracking
 */
export async function GET(request: NextRequest) {
  try {
    // Get test parameters from query string
    const searchParams = request.nextUrl.searchParams;
    const to = searchParams.get('to') || 'test@example.com';
    const documentId = searchParams.get('documentId') || 'test-doc-123';
    
    // Generate a test sign link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const signLink = `${baseUrl}/documents/${documentId}/sign`;
    
    // Send a test email with tracking
    const response = await fetch(`${baseUrl}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject: 'Test Email Tracking',
        templateName: 'document-invite',
        templateData: {
          recipientName: 'Test User',
          senderName: 'DocuAlly System',
          documentName: 'Test Document',
          signLink,
          message: 'This is a test email to verify email tracking functionality.',
        },
        documentId,
        recipientId: 'test-recipient-123',
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({
        success: false,
        error: 'Failed to send test email',
        details: errorData,
      }, { status: response.status });
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      data,
      instructions: `
        1. Check your email at ${to}
        2. Open the email to trigger the tracking pixel
        3. Click on links to test click tracking
        4. View logs at ${baseUrl}/api/email/logs?documentId=${documentId}
      `,
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
} 