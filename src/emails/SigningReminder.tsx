import React from 'react';

interface SigningReminderProps {
  recipientName: string;
  documentName: string;
  signLink: string;
  expiryDate: string;
  senderName: string;
  companyName?: string;
  emailId: string; // For tracking
}

export const SigningReminder: React.FC<SigningReminderProps> = ({
  recipientName,
  documentName,
  signLink,
  expiryDate,
  senderName,
  companyName = 'Docually',
  emailId
}) => {
  // We'll add the tracking query param to links
  const trackingLink = `${signLink}${signLink.includes('?') ? '&' : '?'}emailId=${emailId}`;

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      color: '#333',
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: '#f59e0b',
          marginBottom: '16px',
        }}>
          Reminder: Document Awaiting Your Signature
        </h1>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '16px' }}>
          Hello {recipientName},
        </p>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '16px' }}>
          This is a friendly reminder that the document <strong>"{documentName}"</strong> is still waiting for your signature.
        </p>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '16px' }}>
          The document will expire on <strong>{expiryDate}</strong>, so please sign it before then.
        </p>
        
        <div style={{ marginTop: '32px', marginBottom: '32px', textAlign: 'center' }}>
          <a 
            href={trackingLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block',
            }}
            onClick={() => {
              // Send tracking data
              fetch('/api/email/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  emailId,
                  linkId: 'sign-document-reminder-button',
                }),
              }).catch(console.error);
            }}
          >
            Sign Document Now
          </a>
        </div>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '16px' }}>
          If you have any questions, please contact the sender directly.
        </p>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '16px' }}>
          Thank you,<br />
          {senderName}<br />
          {companyName}
        </p>
      </div>
      
      <div style={{
        borderTop: '1px solid #eaeaea',
        paddingTop: '16px',
        marginTop: '16px',
        fontSize: '12px',
        color: '#666',
      }}>
        <p>
          This is an automated reminder from {companyName}. Please do not reply to this email.
        </p>
      </div>
    </div>
  );
}; 