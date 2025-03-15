import { NextRequest, NextResponse } from 'next/server';

// Import the email logs from the send route
// In a real application, this would be stored in a database
// For demo purposes, we're using a mock implementation
const mockLogs = [
  {
    id: 'email_1',
    documentId: 'test-doc-123',
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
    id: 'email_2',
    documentId: 'test-doc-123',
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
    }
  },
  {
    id: 'email_3',
    documentId: 'test-doc-456',
    recipientEmail: 'recipient3@example.com',
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
    }
  }
];

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
    
    // Filter logs by document ID
    const logs = mockLogs.filter(log => log.documentId === documentId);
    
    return NextResponse.json({ 
      success: true, 
      data: logs,
      message: 'Using mock data for demonstration purposes'
    });
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 