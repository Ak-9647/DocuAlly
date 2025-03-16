'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DocumentCard } from '@/components/DocumentCard';
import { Loader2, Plus } from 'lucide-react';

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();

  // Fetch documents from Convex
  const documents = useQuery(api.documents.getByUser, userId ? { userId } : "skip");

  // Filter documents based on active tab
  const filteredDocuments = documents?.filter(doc => {
    if (activeTab === 'all') return true;
    if (activeTab === 'awaiting') return doc.status.toLowerCase() === 'pending';
    if (activeTab === 'completed') return doc.status.toLowerCase() === 'signed';
    if (activeTab === 'drafts') return doc.status.toLowerCase() === 'draft';
    return true;
  });

  // Check if there are any documents
  const hasDocuments = filteredDocuments && filteredDocuments.length > 0;

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-36"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
              <p className="mt-1 text-sm text-gray-500">Manage and track all your documents</p>
            </div>
            <Link href="/documents/upload">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm flex items-center gap-2">
                <Plus className="h-5 w-5" />
                New Document
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('all')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Documents
              </button>
              <button
                onClick={() => setActiveTab('awaiting')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'awaiting'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Awaiting Signature
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'drafts'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Drafts
              </button>
            </nav>
          </div>
  
          <div className="p-6">
            {documents === undefined ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : !hasDocuments ? (
              <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
                <svg
                  className="mx-auto h-16 w-16 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No documents found</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  {activeTab === 'all' 
                    ? "Get started by uploading a document to sign or share with others for signatures."
                    : `No ${activeTab === 'awaiting' ? 'pending' : activeTab === 'completed' ? 'signed' : 'draft'} documents found.`
                  }
                </p>
                <div className="mt-8">
                  <Link href="/documents/upload">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm">
                      Upload Document
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDocuments.map((document) => (
                  <DocumentCard
                    key={document._id}
                    id={document._id}
                    title={document.title}
                    status={document.status}
                    createdAt={document.createdAt}
                    ownerId={document.ownerId}
                    fileType={document.fileType}
                    fileSize={document.fileSize}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-10 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Need Help?</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Learn how to get the most out of DocuAlly
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">User Guides</h4>
                <p className="text-sm text-gray-500 flex-grow">
                  Detailed documentation on how to use all features of the platform.
                </p>
                <a href="#" className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Read the guides →
                </a>
              </div>
              
              <div className="flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">FAQs</h4>
                <p className="text-sm text-gray-500 flex-grow">
                  Answers to commonly asked questions about using DocuAlly.
                </p>
                <a href="#" className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View FAQs →
                </a>
              </div>
              
              <div className="flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Support</h4>
                <p className="text-sm text-gray-500 flex-grow">
                  Need additional help? Our support team is ready to assist you.
                </p>
                <a href="#" className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Contact support →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 