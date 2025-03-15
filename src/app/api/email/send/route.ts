import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderEmailToHtml } from '@/lib/email';
import { DocumentInvite } from '@/emails/DocumentInvite';
import { SigningReminder } from '@/emails/SigningReminder';
import { SignatureComplete } from '@/emails/SignatureComplete';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory storage for email logs (for demo purposes)
// In a production environment, this would be stored in a database
const emailLogs: Record<string, any> = {};

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
    const emailLogId = `email_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    emailLogs[emailLogId] = {
      id: emailLogId,
      documentId,
      recipientId,
      recipientEmail: to,
      emailType: templateName,
      status: 'pending',
      sentAt: Date.now(),
      metadata: {
        subject,
        timestamp: new Date().toISOString(),
      }
    };

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

    // For demo purposes, we'll skip actually sending the email if no API key is provided
    // This allows testing the tracking functionality without sending real emails
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key') {
      console.log('Skipping email send (no API key). Would have sent to:', to);
      console.log('Email subject:', subject);
      console.log('Email template:', templateName);
      
      // Update the email log with "sent" status
      emailLogs[emailLogId].status = 'sent';
      emailLogs[emailLogId].metadata.messageId = 'mock-message-id';
      emailLogs[emailLogId].metadata.sentAt = Date.now();
      
      return NextResponse.json({
        success: true,
        messageId: 'mock-message-id',
        emailLogId,
        note: 'Email not actually sent (demo mode). Check the tracking dashboard to see tracking in action.'
      });
    }

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
      
      // Update email log status to failed
      emailLogs[emailLogId].status = 'failed';
      emailLogs[emailLogId].metadata.error = emailResponse.error;
      emailLogs[emailLogId].metadata.failedAt = Date.now();
      
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResponse.error },
        { status: 500 }
      );
    }

    // Update the email log with sent status
    emailLogs[emailLogId].status = 'sent';
    emailLogs[emailLogId].metadata.messageId = emailResponse.data?.id;
    emailLogs[emailLogId].metadata.sentAt = Date.now();

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