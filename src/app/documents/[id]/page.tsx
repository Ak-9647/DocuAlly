'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DocumentViewer } from '@/components/DocumentViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function DocumentViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const documentId = params.id;
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real implementation, this would fetch the document data from the server
  const documentUrl = '/placeholder-document.png'; // Placeholder
  const totalPages = 3; // Placeholder
  
  const handleAddSignature = (page: number, x: number, y: number) => {
    console.log('Adding signature at page', page, 'position', x, y);
    // In a real implementation, this would add a signature to the document
  };
  
  return (
    <ProtectedRoute>
      <div className="container max-w-screen-xl mx-auto py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Document Preview</h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button onClick={() => router.push(`/documents/${documentId}/sign`)}>
                Continue to Sign
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <DocumentViewer 
                documentUrl={documentUrl}
                totalPages={totalPages}
                onAddSignature={handleAddSignature}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
