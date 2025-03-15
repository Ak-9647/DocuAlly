import { NextRequest, NextResponse } from 'next/server';

/**
 * GET handler for retrieving email logs for a document
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const documentId = searchParams.get('documentId');
    
    if (!documentId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing document ID' 
      }, { status: 400 });
    }
    
    // For now, we'll return mock data since we're having issues with Convex
    // This allows us to test the UI without requiring the backend to be fully functional
    const mockLogs = [
      {
        id: `log_${Date.now()}_1`,
        documentId,
        recipientEmail: 'recipient1@example.com',
        emailType: 'document-invite',
        status: 'sent',
        sentAt: Date.now() - 7200000, // 2 hours ago
        metadata: {
          messageId: 'mock-message-id-1',
          subject: 'Please sign this document',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        }
      },
      {
        id: `log_${Date.now()}_2`,
        documentId,
        recipientEmail: 'recipient2@example.com',
        emailType: 'document-invite',
        status: 'opened',
        sentAt: Date.now() - 7000000,
        metadata: {
          messageId: 'mock-message-id-2',
          subject: 'Please sign this document',
          timestamp: new Date(Date.now() - 7000000).toISOString(),
          openedAt: Date.now() - 6500000,
          statusUpdatedAt: Date.now() - 6500000,
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        }
      },
      {
        id: `log_${Date.now()}_3`,
        documentId,
        recipientEmail: 'recipient2@example.com',
        emailType: 'signing-reminder',
        status: 'clicked',
        sentAt: Date.now() - 3600000, // 1 hour ago
        metadata: {
          messageId: 'mock-message-id-3',
          subject: 'Reminder: Please sign this document',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          openedAt: Date.now() - 3500000,
          clickedAt: Date.now() - 3400000,
          statusUpdatedAt: Date.now() - 3400000,
          linkId: 'sign-document-button',
        }
      },
      {
        id: `log_${Date.now()}_4`,
        documentId,
        recipientEmail: 'recipient1@example.com',
        emailType: 'signature-complete',
        status: 'sent',
        sentAt: Date.now() - 1800000, // 30 minutes ago
        metadata: {
          messageId: 'mock-message-id-4',
          subject: 'Document has been signed',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
        }
      }
    ];
    
    return NextResponse.json({ 
      success: true, 
      data: mockLogs,
      message: 'Using mock data while Convex integration is being set up'
    });
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 