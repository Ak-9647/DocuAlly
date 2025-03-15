import { NextRequest, NextResponse } from 'next/server';

/**
 * POST handler for creating new email log entries
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      documentId, 
      recipientId, 
      recipientEmail, 
      emailType, 
      status, 
      metadata 
    } = body;
    
    // Validate required fields
    if (!documentId || !emailType || !status) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: documentId, emailType, or status' 
      }, { status: 400 });
    }
    
    // Create log entry in Convex
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Server configuration error' 
      }, { status: 500 });
    }
    
    try {
      const response = await fetch(`${convexUrl}/api/mutation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'emailLogs/create',
          args: { 
            documentId, 
            recipientId, 
            recipientEmail, 
            emailType, 
            status, 
            metadata: metadata || {}
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Convex API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      return NextResponse.json({ 
        success: true, 
        data: { 
          id: result,
          timestamp: new Date().toISOString() 
        }
      });
    } catch (dbError) {
      console.error('Failed to create email log:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database error', details: (dbError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating email log:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 