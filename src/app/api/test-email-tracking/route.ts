import { NextRequest, NextResponse } from 'next/server';

/**
 * GET handler for sending a test email with tracking
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const to = searchParams.get('to') || 'test@example.com';
    const documentId = searchParams.get('documentId') || 'test-doc-123';
    
    // Prepare the email data
    const emailData = {
      to,
      subject: 'Test Email Tracking - Please Open',
      templateName: 'document-invite',
      templateData: {
        documentName: 'Test Document',
        recipientName: to.split('@')[0],
        signLink: `${process.env.NEXT_PUBLIC_APP_URL}/sign/${documentId}?tracking=true`,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        senderName: 'Test Sender',
        companyName: 'Docually',
        plainText: `This is a test email for tracking. Please open to trigger tracking pixel.`
      },
      documentId,
      recipientId: `recipient-${Date.now()}`
    };
    
    // Send the email using our email API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send email: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: `Test email sent to ${to}`,
      emailLogId: data.emailLogId,
      note: 'Check your email and open it to trigger tracking events'
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
} 