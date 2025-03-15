import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for tracking events (for demo purposes)
// In a production environment, this would be stored in a database
const trackingEvents: Record<string, any[]> = {};

/**
 * GET handler for pixel tracking (email opens)
 * This endpoint returns a 1x1 transparent GIF and logs the email open event
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const emailId = searchParams.get('id');
    
    // Return a transparent 1x1 pixel GIF regardless of tracking success
    // This ensures the email doesn't appear broken to the user
    const TRANSPARENT_GIF_PIXEL = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    
    // Set response headers for the pixel
    const headers = {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    // If no email ID, just return the pixel
    if (!emailId) {
      return new NextResponse(TRANSPARENT_GIF_PIXEL, { 
        status: 200,
        headers
      });
    }
    
    // Log the email open event to our in-memory storage
    if (!trackingEvents[emailId]) {
      trackingEvents[emailId] = [];
    }
    
    trackingEvents[emailId].push({
      type: 'opened',
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || '',
      ip: request.headers.get('x-forwarded-for') || '',
    });
    
    console.log(`Email opened: ${emailId}`);
    console.log(`Total events for this email: ${trackingEvents[emailId].length}`);
    
    return new NextResponse(TRANSPARENT_GIF_PIXEL, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error tracking email open:', error);
    
    // Still return the pixel to avoid breaking the email display
    const TRANSPARENT_GIF_PIXEL = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    
    return new NextResponse(TRANSPARENT_GIF_PIXEL, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  }
}

/**
 * POST handler for link click tracking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailId, linkId, documentId, recipientEmail } = body;
    
    if (!emailId) {
      return NextResponse.json({ success: false, error: 'Missing email ID' }, { status: 400 });
    }
    
    // Log the email click event to our in-memory storage
    if (!trackingEvents[emailId]) {
      trackingEvents[emailId] = [];
    }
    
    trackingEvents[emailId].push({
      type: 'clicked',
      linkId,
      documentId,
      recipientEmail,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || '',
      ip: request.headers.get('x-forwarded-for') || '',
    });
    
    console.log(`Email link clicked: ${emailId}, link: ${linkId}`);
    console.log(`Total events for this email: ${trackingEvents[emailId].length}`);
    
    return NextResponse.json({ 
      success: true,
      message: 'Click tracked successfully',
      events: trackingEvents[emailId]
    });
  } catch (error) {
    console.error('Error tracking email click:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET handler for retrieving tracking events for a specific email
 * This is for debugging purposes
 */
export async function HEAD(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const emailId = searchParams.get('id');
    
    if (!emailId) {
      return NextResponse.json({ success: false, error: 'Missing email ID' }, { status: 400 });
    }
    
    const events = trackingEvents[emailId] || [];
    
    return NextResponse.json({ 
      success: true,
      emailId,
      events,
      count: events.length
    });
  } catch (error) {
    console.error('Error retrieving tracking events:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 