'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

export default function DocumentCompletePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const documentId = params.id;
  
  return (
    <ProtectedRoute>
      <div className="container max-w-screen-xl mx-auto py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Document Completed</h1>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
          
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Signing Complete</CardTitle>
              <Badge className="bg-success text-success-foreground">Completed</Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>
                <h2 className="text-xl font-semibold">Document Successfully Signed!</h2>
                <p className="text-center text-muted-foreground max-w-md">
                  All parties have completed signing the document. You can download the signed document or view the details below.
                </p>
                <div className="flex space-x-4 mt-4">
                  <Button variant="outline">Download PDF</Button>
                  <Button>View Document</Button>
                </div>
              </div>
              
              <div className="border-t mt-6 pt-6">
                <h3 className="text-lg font-medium mb-4">Document Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Document ID</p>
                      <p className="font-medium">{documentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed On</p>
                      <p className="font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Signatories</p>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div>
                          <p className="font-medium">You</p>
                          <p className="text-xs text-muted-foreground">user@example.com</p>
                        </div>
                        <Badge className="bg-success text-success-foreground">Signed</Badge>
                      </div>
                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div>
                          <p className="font-medium">Partner</p>
                          <p className="text-xs text-muted-foreground">partner@example.com</p>
                        </div>
                        <Badge className="bg-success text-success-foreground">Signed</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t mt-6 pt-6">
                <h3 className="text-lg font-medium mb-4">Verification</h3>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm">
                    This document has been electronically signed in accordance with the Electronic Signatures in Global and National Commerce Act (E-Sign Act) and is legally binding.
                  </p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p>Verification Code: {Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
                    <p>Timestamp: {new Date().toISOString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
