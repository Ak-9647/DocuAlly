# Not-DocuSign MVP

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
git clone https://github.com/Ak-9647/Not-Docusign.git
cd Not-Docusign
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

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

## Deployment

The application can be deployed to Cloudflare Pages with Cloudflare Workers for backend functionality.

## License

This project is licensed under the MIT License.
