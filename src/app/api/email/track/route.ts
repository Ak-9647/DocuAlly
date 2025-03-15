import { NextRequest, NextResponse } from 'next/server';

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
    
    try {
      // Log the email open event via the Convex API
      // Using direct fetch to avoid typecasting issues
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      if (convexUrl) {
        await fetch(`${convexUrl}/api/mutation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: 'emailLogs/updateStatus',
            args: {
              id: emailId,
              status: 'opened',
              metadata: {
                openedAt: Date.now(),
                userAgent: request.headers.get('user-agent') || '',
                ip: request.headers.get('x-forwarded-for') || '',
              }
            }
          }),
        });
      } else {
        console.error('Missing Convex URL in environment variables');
      }
    } catch (dbError) {
      // Log database error but continue serving the pixel
      console.error('Failed to record email open in database:', dbError);
    }
    
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
    
    try {
      // Log the email click event via the Convex API
      // Using direct fetch to avoid typecasting issues
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      if (convexUrl) {
        await fetch(`${convexUrl}/api/mutation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: 'emailLogs/updateStatus',
            args: {
              id: emailId,
              status: 'clicked',
              metadata: {
                clickedAt: Date.now(),
                linkId,
                documentId,
                recipientEmail,
                userAgent: request.headers.get('user-agent') || '',
                ip: request.headers.get('x-forwarded-for') || '',
              }
            }
          }),
        });
      } else {
        console.error('Missing Convex URL in environment variables');
        return NextResponse.json(
          { success: false, error: 'Server configuration error' },
          { status: 500 }
        );
      }
    } catch (dbError) {
      console.error('Failed to record email click in database:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database error', details: (dbError as Error).message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Click tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking email click:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 