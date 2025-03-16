import React from 'react';

interface SignatureCompleteProps {
  recipientName: string;
  documentName: string;
  viewLink: string;
  senderName: string;
  companyName?: string;
  emailId: string; // For tracking
}

export const SignatureComplete: React.FC<SignatureCompleteProps> = ({
  recipientName,
  documentName,
  viewLink,
  senderName,
  companyName = 'Docually',
  emailId
}) => {
  // We'll add the tracking query param to links
  const trackingLink = `${viewLink}${viewLink.includes('?') ? '&' : '?'}emailId=${emailId}`;

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
          color: '#10b981',
          marginBottom: '16px',
        }}>
          Document Successfully Signed
        </h1>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '16px' }}>
          Hello {recipientName},
        </p>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '16px' }}>
          Great news! The document <strong>"{documentName}"</strong> has been successfully signed by all parties.
        </p>
        
        <div style={{ marginTop: '32px', marginBottom: '32px', textAlign: 'center' }}>
          <a 
            href={trackingLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#10b981',
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
                  linkId: 'view-document-button',
                }),
              }).catch(console.error);
            }}
          >
            View Completed Document
          </a>
        </div>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '16px' }}>
          A copy of the signed document has been saved and is available for your records.
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
          This is an automated message from {companyName}. Please do not reply to this email.
        </p>
      </div>
    </div>
  );
}; 