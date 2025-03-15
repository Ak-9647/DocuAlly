# DocuAlly MVP

A simplified document signing platform with AI-powered features, built with Next.js and Tailwind CSS.

## Features

- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Document Management**: Upload, view, and manage documents
- **AI-Powered Features**: 
  - Automatic field detection
  - Document analysis and summary generation
  - Smart recipient suggestions
- **Electronic Signatures**: Draw and place signatures on documents
- **Document Sharing**: Share documents via email or shareable links
- **User Authentication**: Secure login and registration
- **AI Document Template Generation**: Create standard templates for agreements using AI.
- **E-Signature**: Allow multiple parties to sign and date documents.
- **Document Routing**: Send agreements to multiple signatories sequentially.
- **Authentication and Verification**: Make signatures legally binding.
- **Document Status Tracking**: Show signature progress across multiple parties.
- **Email Notifications**: Automated emails for document signing workflows.

## Tech Stack

- **Frontend**: Next.js with Tailwind CSS
- **Backend**: Cloudflare Workers with D1 Database
- **Authentication**: Client-side auth with secure session management
- **Storage**: Document storage with preview capabilities

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ak-9647/DocuAlly.git
cd DocuAlly
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Clerk API keys
   - Add your Resend API key for email functionality

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/app`: Next.js pages and API routes
- `src/components`: Reusable UI components
- `src/lib`: Utility functions and authentication
- `migrations`: Database schema and migrations

## AI Features

The application includes several AI-powered features:

1. **Document Analysis**: Analyzes document content to identify key information
2. **Field Detection**: Automatically detects where signatures and other fields should be placed
3. **Document Summary**: Generates summaries of document content with key points
4. **Recipient Suggestions**: Suggests potential recipients based on document content

## Email Functionality

DocuAlly uses [Resend](https://resend.com) for sending email notifications throughout the document signing workflow. This enhances the user experience by keeping all parties informed about the status of documents.

### Setting Up Email Functionality

1. Create an account on [Resend](https://resend.com)
2. Generate an API key in the Resend dashboard
3. Add the API key to your `.env.local` file:
   ```
   RESEND_API_KEY=your_resend_api_key
   ```

### Email Notification Types

The platform sends email notifications for the following events:

1. **Document Signing Requests**: When a document is sent for signing, recipients receive an email with a link to sign the document.
2. **Signing Reminders**: Document owners can send reminders to recipients who haven't signed yet.
3. **Signature Notifications**: When a recipient signs a document, the document owner is notified.
4. **Completion Notifications**: When all parties have signed a document, everyone receives a notification.

### Email Templates

Email templates are defined as React components using the `@react-email/components` library:

- `DocumentInviteEmail`: Sent when requesting a signature
- `SigningReminderEmail`: Sent as a reminder to sign
- `SignatureCompleteEmail`: Sent when a document is signed or fully completed

You can customize these templates in the `src/emails/` directory.

### Email Tracking

DocuAlly includes an email tracking system that logs all email events:

- Tracks when emails are sent, delivered, opened, and clicked
- Provides a dashboard for document owners to view email activity
- Stores email logs in the database for audit purposes

### Webhook Integration

For production use, you can set up Resend webhooks to track email events:

1. Configure a webhook endpoint in the Resend dashboard pointing to `/api/email/track`
2. Events will be automatically logged in the database
3. The UI will update in real-time as emails are delivered and opened

### Security Considerations

- API keys are stored securely in environment variables
- Email sending is rate-limited to prevent abuse
- All email templates include unsubscribe links
- Email addresses are validated before sending

## Deployment

The application can be deployed to Cloudflare Pages with Cloudflare Workers for backend functionality.

## License

This project is licensed under the MIT License.
