# API Endpoints for Not-DocuSign MVP

## Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get current user information

## Document Endpoints
- `POST /api/documents` - Upload a new document
- `GET /api/documents` - List all documents for the current user
- `GET /api/documents/:id` - Get a specific document
- `PUT /api/documents/:id` - Update document information
- `DELETE /api/documents/:id` - Delete a document

## Signature Endpoints
- `POST /api/documents/:id/signatures` - Add a signature to a document
- `GET /api/documents/:id/signatures` - Get all signatures for a document
- `PUT /api/documents/:id/signatures/:signatureId` - Update a signature
- `DELETE /api/documents/:id/signatures/:signatureId` - Delete a signature

## Document Sharing Endpoints
- `POST /api/documents/:id/share` - Share a document with another user
- `GET /api/documents/shared` - Get documents shared with the current user
- `GET /api/documents/:id/shares` - Get all shares for a document
- `DELETE /api/documents/:id/shares/:shareId` - Remove a share

## AI Feature Endpoints
- `POST /api/ai/analyze-document` - Analyze document content and suggest signature fields
- `POST /api/ai/generate-summary` - Generate a summary of the document
- `POST /api/ai/extract-fields` - Extract key fields from a document
- `POST /api/ai/suggest-recipients` - Suggest recipients based on document content
