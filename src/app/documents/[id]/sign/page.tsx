'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DocumentViewer } from '@/components/DocumentViewer';
import { SignaturePad } from '@/components/SignaturePad';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function DocumentSignPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const documentId = params.id;
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signaturePosition, setSignaturePosition] = useState<{ page: number; x: number; y: number } | null>(null);
  
  // In a real implementation, this would fetch the document data from the server
  const documentUrl = '/placeholder-document.png'; // Placeholder
  const totalPages = 3; // Placeholder
  
  const handleAddSignature = (page: number, x: number, y: number) => {
    setSignaturePosition({ page, x, y });
    setIsSignatureModalOpen(true);
  };
  
  const handleSaveSignature = (data: string) => {
    setSignatureData(data);
    setIsSignatureModalOpen(false);
    
    // In a real implementation, this would save the signature to the document
    console.log('Saving signature at position', signaturePosition);
  };
  
  const handleCancelSignature = () => {
    setIsSignatureModalOpen(false);
    setSignaturePosition(null);
  };
  
  const handleCompleteSigningProcess = () => {
    // In a real implementation, this would finalize the document signing process
    router.push('/dashboard');
  };
  
  return (
    <ProtectedRoute>
      <div className="container max-w-screen-xl mx-auto py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Sign Document</h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Cancel
              </Button>
              <Button onClick={handleCompleteSigningProcess} disabled={!signatureData}>
                Complete Signing
              </Button>
            </div>
          </div>
          
          <div className="bg-secondary/30 p-4 rounded-lg">
            <p className="text-center">
              Click on the document where you want to add your signature
            </p>
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
        
        <Dialog open={isSignatureModalOpen} onOpenChange={setIsSignatureModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Your Signature</DialogTitle>
            </DialogHeader>
            <SignaturePad 
              onSave={handleSaveSignature}
              onCancel={handleCancelSignature}
            />
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
