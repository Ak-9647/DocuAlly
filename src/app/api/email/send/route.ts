import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderEmailToHtml } from '@/lib/email';
import { DocumentInvite } from '@/emails/DocumentInvite';
import { SigningReminder } from '@/emails/SigningReminder';
import { SignatureComplete } from '@/emails/SignatureComplete';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      to, 
      subject, 
      templateName, 
      templateData,
      documentId,
      recipientId 
    } = body;

    // Validate required fields
    if (!to || !subject || !templateName) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, or templateName' },
        { status: 400 }
      );
    }

    // Create an email log entry first to get the ID
    let emailLogId;
    try {
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      if (convexUrl && documentId) {
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
              recipientEmail: to,
              emailType: templateName,
              status: 'pending',
              metadata: {
                subject,
                timestamp: new Date().toISOString(),
              }
            }
          }),
        });
        
        if (response.ok) {
          const result = await response.json();
          emailLogId = result;
        }
      }
    } catch (error) {
      console.error('Failed to create email log:', error);
      // Continue without email tracking if log creation fails
    }

    // Get the appropriate email template component based on templateName
    let EmailTemplate;
    switch (templateName) {
      case 'document-invite':
        EmailTemplate = DocumentInvite;
        break;
      case 'signing-reminder':
        EmailTemplate = SigningReminder;
        break;
      case 'signature-complete':
        EmailTemplate = SignatureComplete;
        break;
      default:
        return NextResponse.json(
          { error: `Unknown template: ${templateName}` },
          { status: 400 }
        );
    }

    // Add email ID to template data for tracking
    const enhancedTemplateData = {
      ...templateData,
      emailId: emailLogId,
      documentId,
      recipientEmail: to
    };

    // Render the React email template to HTML
    const html = await renderEmailToHtml(EmailTemplate, enhancedTemplateData);

    // Send the email using Resend API
    const emailResponse = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@docually.com',
      to,
      subject,
      html,
      // Optional text version for clients that don't support HTML
      text: templateData.plainText || `Please view this email in a compatible email client.`,
    });

    if (emailResponse.error) {
      console.error('Resend API error:', emailResponse.error);
      
      // Update email log status to failed if we have an ID
      if (emailLogId) {
        try {
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
                  id: emailLogId,
                  status: 'failed',
                  metadata: {
                    error: emailResponse.error,
                    timestamp: new Date().toISOString(),
                  }
                }
              }),
            });
          }
        } catch (updateError) {
          console.error('Failed to update email log status:', updateError);
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResponse.error },
        { status: 500 }
      );
    }

    // Update the email log with sent status
    if (emailLogId) {
      try {
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
                id: emailLogId,
                status: 'sent',
                metadata: {
                  messageId: emailResponse.data?.id,
                  to,
                  subject,
                  timestamp: new Date().toISOString(),
                }
              }
            }),
          });
        }
      } catch (updateError) {
        console.error('Failed to update email log status:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      messageId: emailResponse.data?.id,
      emailLogId
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
} 