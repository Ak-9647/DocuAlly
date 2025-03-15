import { NextRequest, NextResponse } from 'next/server';

/**
 * GET handler for tracking email link clicks and redirecting to the original URL
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const emailId = searchParams.get('emailId');
    const linkId = searchParams.get('linkId');
    
    // If no target URL provided, redirect to homepage
    if (!url) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // If email ID provided, track the click event
    if (emailId) {
      try {
        // Send the tracking data to our tracking endpoint
        await fetch(new URL('/api/email/track', request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailId,
            linkId,
            timestamp: new Date().toISOString(),
            userAgent: request.headers.get('user-agent') || '',
            ip: request.headers.get('x-forwarded-for') || '',
          }),
        });
      } catch (error) {
        // Log error but still continue with redirect
        console.error('Error tracking email link click:', error);
      }
    }
    
    // Ensure the URL is properly formatted
    let redirectUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      redirectUrl = `https://${url}`;
    }
    
    // Redirect to the target URL
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error processing redirect:', error);
    
    // In case of error, redirect to homepage
    return NextResponse.redirect(new URL('/', request.url));
  }
} 