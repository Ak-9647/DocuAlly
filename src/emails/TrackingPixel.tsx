import React from 'react';
import { getTrackingPixelUrl } from '@/lib/email';

interface TrackingPixelProps {
  emailId: string;
}

/**
 * A component that renders an invisible tracking pixel for email open tracking.
 * This should be included at the bottom of email templates.
 */
export function TrackingPixel({ emailId }: TrackingPixelProps) {
  if (!emailId) return null;
  
  const trackingUrl = getTrackingPixelUrl(emailId);
  
  return (
    <img 
      src={trackingUrl} 
      width="1" 
      height="1" 
      alt="" 
      style={{ 
        display: 'none',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '1px',
        height: '1px',
      }} 
    />
  );
}

/**
 * A component that wraps links with tracking functionality.
 */
export function TrackingLink({ 
  href, 
  emailId, 
  linkId, 
  documentId, 
  recipientEmail,
  children,
  style,
  ...props
}: {
  href: string;
  emailId: string;
  linkId?: string;
  documentId?: string;
  recipientEmail?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}) {
  if (!emailId || !href) {
    return (
      <a href={href} style={style} {...props}>
        {children}
      </a>
    );
  }
  
  // Import dynamically to avoid server-side rendering issues
  const { getTrackingLinkUrl } = require('@/lib/email');
  
  const trackingUrl = getTrackingLinkUrl(
    href,
    emailId,
    linkId,
    documentId,
    recipientEmail
  );
  
  return (
    <a href={trackingUrl} style={style} {...props}>
      {children}
    </a>
  );
} 