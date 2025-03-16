# DocuAlly

A modern document signing platform with advanced email tracking capabilities.

## Features

- **Document Management**: Upload, organize, and manage documents for signing
- **Electronic Signatures**: Secure and legally binding electronic signatures
- **Email Notifications**: Automated email notifications for document signing workflows
- **Email Tracking**: Track email opens, clicks, and engagement with comprehensive analytics
- **User Management**: Invite users, assign roles, and manage permissions

## Email Tracking System

The platform includes a robust email tracking system that:

- Tracks when recipients open emails (via tracking pixel)
- Monitors link clicks within emails
- Records all email activities in a Convex database
- Provides analytics on email engagement

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Convex
- **Email Service**: Resend
- **Authentication**: Clerk

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_from_email
```

## License

MIT
