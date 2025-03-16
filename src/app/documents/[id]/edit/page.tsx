'use client';

import { useParams, useRouter } from 'next/navigation';
import { DocumentEditor } from '@/components/DocumentEditor';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function EditDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const documentId = params.id as string;
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);
  
  // Convert string ID to Convex ID
  const convexDocId = documentId ? Id.fromString(documentId) : null;
  
  // Fetch document data
  const document = useQuery(
    api.documents.getById, 
    convexDocId ? { id: convexDocId } : "skip"
  );
  
  // Loading state
  if (!isLoaded || document === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-gray-500">Loading document...</p>
        </div>
      </div>
    );
  }
  
  // Document not found
  if (document === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Document Not Found</h1>
          <p className="text-gray-600 mb-6">The document you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button 
            onClick={() => router.push('/documents')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Return to Documents
          </Button>
        </div>
      </div>
    );
  }
  
  // For demo purposes, we'll use a sample PDF URL
  // In a real app, this would be a URL to the actual PDF file stored in your system
  const documentUrl = "https://www.africau.edu/images/default/sample.pdf";
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Document</h1>
        <Button 
          variant="outline"
          onClick={() => router.push(`/documents/${documentId}`)}
        >
          Back to Document
        </Button>
      </div>
      
      <DocumentEditor 
        documentId={documentId}
        documentName={document.title}
        documentContent={document.content}
        documentUrl={documentUrl}
      />
    </div>
  );
} 