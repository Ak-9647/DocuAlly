'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DocumentEditor } from '@/components/DocumentEditor';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DocumentSigning } from '@/components/DocumentSigning';
import { DocumentStatusTracker } from '@/components/DocumentStatusTracker';
import { DocumentVerification } from '@/components/DocumentVerification';
import { DocumentRouting } from '@/components/DocumentRouting';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';

interface DocumentPageProps {
  params: {
    id: string;
  };
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const { id } = params;
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [document, setDocument] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Convert string ID to Convex ID
  const convexDocId = id ? Id.fromString(id) : null;
  
  // Fetch document data
  const documentData = useQuery(
    api.documents.getById, 
    convexDocId ? { id: convexDocId } : "skip"
  );
  
  // In a real app, these would be fetched from an API
  const documentName = "Business Services Agreement";
  const documentUrl = "https://www.africau.edu/images/default/sample.pdf";
  const documentStatus = "sent";
  const createdAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago
  const expiresAt = new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(); // 23 days from now
  
  const recipients = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      status: "signed" as const,
      signedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      viewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      status: "pending" as const
    },
    {
      id: "3",
      name: "Current User",
      email: "user@example.com",
      status: "pending" as const
    }
  ];
  
  const handleRoutingComplete = (recipients: any[]) => {
    console.log("Routing complete with recipients:", recipients);
    // In a real app, this would send the document to recipients
    alert(`Document would be sent to ${recipients.length} recipients`);
  };

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would be an API call to fetch the document
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock document data
        const mockDocument = {
          id: id,
          name: documentName,
          content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into as of [Effective Date] by and between:

Party 1: [Company Name], with its principal place of business at [Address] ("Disclosing Party")

and

Party 2: [Recipient Name], with its principal place of business at [Address] ("Receiving Party")

1. CONFIDENTIAL INFORMATION
   For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged.

2. OBLIGATIONS OF RECEIVING PARTY
   Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party.

3. TIME PERIODS
   The confidentiality provisions of this Agreement shall survive the termination of this Agreement and Receiving Party's duty to hold Confidential Information in confidence shall remain in effect until the Confidential Information no longer qualifies as a trade secret or until Disclosing Party sends Receiving Party written notice releasing Receiving Party from this Agreement, whichever occurs first.

4. GOVERNING LAW
   This Agreement shall be governed by and construed in accordance with the laws of [State/Country].

IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.

[Signature 1]                                [Signature 2]
____________________                        ____________________
[Name]                                      [Name]
[Title]                                     [Title]
[Company]                                   [Company]`,
          createdAt: createdAt,
          status: documentStatus
        };
        
        setDocument(mockDocument);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchDocument();
    }
  }, [id, user]);

  if (authLoading || (!document && isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-600">Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Document Details</h1>
        <Link href={`/documents/${id}/edit`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit Document
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="sign">
            <TabsList className="mb-6">
              <TabsTrigger value="sign">Sign</TabsTrigger>
              <TabsTrigger value="route">Route</TabsTrigger>
              <TabsTrigger value="verify">Verify</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sign" className="space-y-6">
              <DocumentSigning 
                documentId={id}
                documentUrl={documentUrl}
                documentName={documentName}
                isOwner={true}
                currentUserEmail="user@example.com"
              />
            </TabsContent>
            
            <TabsContent value="route" className="space-y-6">
              <DocumentRouting 
                documentId={id}
                documentName={documentName}
                onRoutingComplete={handleRoutingComplete}
              />
            </TabsContent>
            
            <TabsContent value="verify" className="space-y-6">
              <DocumentVerification 
                documentId={id}
                documentName={documentName}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <DocumentStatusTracker 
            documentId={id}
            documentName={documentName}
            documentStatus={documentStatus as any}
            createdAt={createdAt}
            expiresAt={expiresAt}
            recipients={recipients}
            isSequential={true}
          />
        </div>
      </div>
    </div>
  );
}
