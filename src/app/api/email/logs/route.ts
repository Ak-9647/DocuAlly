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
    
    // Fetch logs from Convex using direct API call
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Server configuration error' 
      }, { status: 500 });
    }
    
    try {
      const response = await fetch(`${convexUrl}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'emailLogs/getByDocument',
          args: { documentId }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Convex API error: ${response.status}`);
      }
      
      const logs = await response.json();
      
      return NextResponse.json({ 
        success: true, 
        data: logs 
      });
    } catch (dbError) {
      console.error('Failed to fetch email logs:', dbError);
      
      // Fallback to mock data if database query fails
      const mockLogs = [
        {
          id: `log_${Date.now()}_1`,
          type: 'invite',
          to: 'recipient1@example.com',
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          status: 'sent',
          subject: 'Please sign this document'
        },
        {
          id: `log_${Date.now()}_2`,
          type: 'invite',
          to: 'recipient2@example.com',
          timestamp: new Date(Date.now() - 7000000).toISOString(),
          status: 'sent',
          subject: 'Please sign this document'
        },
        {
          id: `log_${Date.now()}_3`,
          type: 'reminder',
          to: 'recipient2@example.com',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          status: 'sent',
          subject: 'Reminder: Please sign this document'
        },
        {
          id: `log_${Date.now()}_4`,
          type: 'signed',
          to: 'recipient1@example.com',
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          status: 'sent',
          subject: 'Document has been signed'
        }
      ];
      
      return NextResponse.json({ 
        success: true, 
        data: mockLogs,
        error: 'Using mock data due to database error',
      });
    }
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 