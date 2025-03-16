/**
 * Email utility functions for document signing notifications
 */
import { Resend } from 'resend';
import { render } from '@react-email/render';
import DocumentInviteEmail from '@/emails/DocumentInvite';
import SigningReminderEmail from '@/emails/SigningReminder';
import SignatureCompleteEmail from '@/emails/SignatureComplete';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Initialize Resend client for client-side usage
let resendClient: Resend | null = null;

/**
 * Get Resend client instance
 * @returns Resend client instance
 */
function getResendClient(): Resend | null {
  if (typeof window === 'undefined') {
    // Server-side: we don't initialize here as it's handled in the API route
    return null;
  }
  
  if (!resendClient) {
    // Client-side: we'll use the API route instead of direct Resend access
    return null;
  }
  
  return resendClient;
}

/**
 * Renders a React email component to HTML
 * @param EmailTemplate The React component to render
 * @param props Props to pass to the component
 * @returns HTML string of the rendered email
 */
export async function renderEmailToHtml(
  EmailTemplate: React.ComponentType<any>,
  props: Record<string, any>
): Promise<string> {
  const emailElement = React.createElement(EmailTemplate, props);
  const html = renderToStaticMarkup(emailElement);
  
  // Add additional wrapper HTML and CSS as needed
  const fullHtml = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.5;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        a {
          color: #0070f3;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .footer {
          margin-top: 32px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${html}
        <div class="footer">
          <p>© ${new Date().getFullYear()} Docually. All rights reserved.</p>
          <p>This email was sent to ${props.recipientEmail || props.to || 'you'}.</p>
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/api/email/track?id=${props.emailId}" alt="" width="1" height="1" />
        </div>
      </div>
    </body>
  </html>`;
  
  return fullHtml;
}

/**
 * Utility function to send an email using our API
 * 
 * @param options Email sending options
 * @returns Response from the email API
 */
export async function sendEmail({
  to,
  subject,
  templateName,
  templateData,
  documentId,
  recipientId
}: {
  to: string;
  subject: string;
  templateName: 'document-invite' | 'signing-reminder' | 'signature-complete';
  templateData: Record<string, any>;
  documentId?: string;
  recipientId?: string;
}) {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        templateName,
        templateData,
        documentId,
        recipientId
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send a document signing request notification
 * @param to Recipient email address
 * @param documentName Name of the document
 * @param senderName Name of the sender
 * @param signLink Link to sign the document
 * @param recipientName Optional name of the recipient
 * @param message Optional message to include in the email
 * @param documentId Optional document ID for tracking
 * @param recipientId Optional recipient ID for tracking
 * @returns Response from the email API
 */
export async function sendSigningRequest({
  to,
  documentName,
  senderName,
  signLink,
  recipientName,
  message,
  documentId,
  recipientId
}: {
  to: string;
  documentName: string;
  senderName: string;
  signLink: string;
  recipientName?: string;
  message?: string;
  documentId?: string;
  recipientId?: string;
}) {
  const subject = `${senderName} has requested your signature on ${documentName}`;
  
  return sendEmail({
    to,
    subject,
    templateName: 'document-invite',
    templateData: {
      recipientName,
      senderName,
      documentName,
      signLink,
      message
    },
    documentId,
    recipientId
  });
}

/**
 * Send a signing reminder notification
 * @param to Recipient email address
 * @param documentName Name of the document
 * @param senderName Name of the sender
 * @param signLink Link to sign the document
 * @param recipientName Optional name of the recipient
 * @param dueDate Optional due date for signing
 * @param documentId Optional document ID for tracking
 * @param recipientId Optional recipient ID for tracking
 * @returns Response from the email API
 */
export async function sendSigningReminder({
  to,
  documentName,
  senderName,
  signLink,
  recipientName,
  dueDate,
  documentId,
  recipientId
}: {
  to: string;
  documentName: string;
  senderName: string;
  signLink: string;
  recipientName?: string;
  dueDate?: string;
  documentId?: string;
  recipientId?: string;
}) {
  const subject = `Reminder: Please sign ${documentName}`;
  
  return sendEmail({
    to,
    subject,
    templateName: 'signing-reminder',
    templateData: {
      recipientName,
      senderName,
      documentName,
      signLink,
      dueDate
    },
    documentId,
    recipientId
  });
}

/**
 * Send a document signed notification
 * @param to Recipient email address
 * @param documentName Name of the document
 * @param signerName Name of the signer
 * @param viewLink Link to view the document
 * @param recipientName Optional name of the recipient
 * @param isFullyCompleted Whether the document is fully completed by all parties
 * @param documentId Optional document ID for tracking
 * @param recipientId Optional recipient ID for tracking
 * @returns Response from the email API
 */
export async function sendSignedNotification({
  to,
  documentName,
  signerName,
  viewLink,
  recipientName,
  isFullyCompleted = false,
  documentId,
  recipientId
}: {
  to: string;
  documentName: string;
  signerName: string;
  viewLink: string;
  recipientName?: string;
  isFullyCompleted?: boolean;
  documentId?: string;
  recipientId?: string;
}) {
  const subject = isFullyCompleted
    ? `Document fully signed: ${documentName}`
    : `${signerName} has signed ${documentName}`;
  
  return sendEmail({
    to,
    subject,
    templateName: 'signature-complete',
    templateData: {
      recipientName,
      signerName,
      documentName,
      viewLink,
      isFullyCompleted
    },
    documentId,
    recipientId
  });
}

/**
 * Generate a tracking pixel URL for email open tracking
 * @param emailId The ID of the email log to track
 * @returns The URL of the tracking pixel
 */
export function getTrackingPixelUrl(emailId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/api/email/track?id=${encodeURIComponent(emailId)}`;
}

/**
 * Generate a tracking URL for email link clicks
 * @param originalUrl The original URL to redirect to
 * @param emailId The ID of the email log
 * @param linkId Optional identifier for the specific link
 * @param documentId Optional document ID for context
 * @param recipientEmail Optional recipient email for context
 * @returns The tracking URL that will redirect to the original URL
 */
export function getTrackingLinkUrl(
  originalUrl: string,
  emailId: string,
  linkId?: string,
  documentId?: string,
  recipientEmail?: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const params = new URLSearchParams({
    url: originalUrl,
    emailId,
    ...(linkId && { linkId }),
    ...(documentId && { documentId }),
    ...(recipientEmail && { recipientEmail }),
  });
  
  return `${baseUrl}/api/email/redirect?${params.toString()}`;
}

/**
 * Track email sending in logs
 * @param emailType Type of email sent
 * @param to Recipient email
 * @param documentId Document ID
 * @param success Whether sending was successful
 * @param metadata Additional tracking metadata
 * @returns void
 */
export async function trackEmailSent(
  emailType: 'invite' | 'reminder' | 'signed' | 'completed',
  to: string,
  documentId: string,
  success: boolean,
  metadata: Record<string, any> = {}
) {
  try {
    // Log to console for development
    console.log(`Email tracking: ${emailType} to ${to} for document ${documentId} - ${success ? 'Success' : 'Failed'}`);
    
    // Call the API endpoint to record the event
    await fetch('/api/email/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        emailType, 
        to, 
        documentId, 
        success, 
        timestamp: new Date().toISOString(),
        metadata
      })
    });
  } catch (error) {
    console.error('Error tracking email:', error);
  }
} 