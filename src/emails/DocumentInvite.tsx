import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';
import { TrackingPixel, TrackingLink } from './TrackingPixel';

interface DocumentInviteProps {
  recipientName?: string;
  senderName: string;
  documentName: string;
  signLink: string;
  message?: string;
  emailId?: string;
  documentId?: string;
  recipientEmail?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://docually.com';

export const DocumentInvite = ({
  recipientName,
  senderName,
  documentName,
  signLink,
  message,
  emailId,
  documentId,
  recipientEmail,
}: DocumentInviteProps) => {
  const previewText = `${senderName} has requested your signature on ${documentName}`;
  
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto p-4 max-w-xl">
            <Section className="bg-white border border-gray-200 rounded-lg p-8 my-8 shadow-sm">
              <Img
                src={`${baseUrl}/images/logo.png`}
                width="120"
                height="40"
                alt="Docually"
                className="mx-auto mb-6"
              />
              
              <Heading className="text-2xl font-bold text-center text-gray-800 mb-4">
                Document Signing Request
              </Heading>
              
              <Text className="text-gray-700 mb-6">
                Hello {recipientName ? recipientName : 'there'},
              </Text>
              
              <Text className="text-gray-700 mb-6">
                <strong>{senderName}</strong> has requested your signature on <strong>{documentName}</strong>.
              </Text>
              
              {message && (
                <Section className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <Text className="text-gray-700 italic">"{message}"</Text>
                </Section>
              )}
              
              <Section className="text-center my-8">
                {emailId ? (
                  <TrackingLink
                    href={signLink}
                    emailId={emailId}
                    linkId="sign-document-button"
                    documentId={documentId}
                    recipientEmail={recipientEmail}
                    className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium no-underline"
                  >
                    Review and Sign Document
                  </TrackingLink>
                ) : (
                  <Button
                    className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium no-underline"
                    href={signLink}
                  >
                    Review and Sign Document
                  </Button>
                )}
              </Section>
              
              <Text className="text-gray-700 mb-6">
                Or copy and paste this link into your browser: {' '}
                {emailId ? (
                  <TrackingLink 
                    href={signLink} 
                    emailId={emailId}
                    linkId="sign-document-text"
                    documentId={documentId}
                    recipientEmail={recipientEmail}
                    className="text-indigo-600 underline"
                  >
                    {signLink}
                  </TrackingLink>
                ) : (
                  <Link href={signLink} className="text-indigo-600 underline">
                    {signLink}
                  </Link>
                )}
              </Text>
              
              <Hr className="border-gray-200 my-6" />
              
              <Text className="text-gray-500 text-sm text-center">
                This is an automated message from Docually, the secure document signing service.
                If you didn't expect this email, please ignore it or contact the sender.
              </Text>
            </Section>
            
            <Text className="text-gray-400 text-xs text-center">
              © {new Date().getFullYear()} Docually, Inc. All rights reserved.
              <br />
              {emailId ? (
                <>
                  <TrackingLink 
                    href={`${baseUrl}/privacy`} 
                    emailId={emailId}
                    linkId="privacy-link"
                    className="text-indigo-500 underline"
                  >
                    Privacy Policy
                  </TrackingLink>{' '}
                  •{' '}
                  <TrackingLink 
                    href={`${baseUrl}/terms`} 
                    emailId={emailId}
                    linkId="terms-link"
                    className="text-indigo-500 underline"
                  >
                    Terms of Service
                  </TrackingLink>
                </>
              ) : (
                <>
                  <Link href={`${baseUrl}/privacy`} className="text-indigo-500 underline">
                    Privacy Policy
                  </Link>{' '}
                  •{' '}
                  <Link href={`${baseUrl}/terms`} className="text-indigo-500 underline">
                    Terms of Service
                  </Link>
                </>
              )}
            </Text>
            
            {/* Add tracking pixel at the bottom of the email */}
            {emailId && <TrackingPixel emailId={emailId} />}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default DocumentInvite; 