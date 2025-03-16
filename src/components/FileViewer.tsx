'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface FileViewerProps {
  documentId: string;
  className?: string;
}

export function FileViewer({ documentId, className = '' }: FileViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert string ID to Convex ID
  const convexDocId = documentId ? Id.fromString(documentId) : null;

  // Fetch file URL from Convex
  const fileData = useQuery(
    api.files.getFileUrl,
    convexDocId ? { documentId: convexDocId } : "skip"
  );

  useEffect(() => {
    if (fileData) {
      setIsLoading(false);
    }
  }, [fileData]);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (numPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= (numPages || 0); i++) {
    pageNumbers.push(i);
  }

  if (!fileData && !error && isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !fileData) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}>
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Document</h3>
        <p className="text-sm text-gray-500">
          {error || "Could not load the document. It may have been deleted or you don't have permission to view it."}
        </p>
      </div>
    );
  }

  // Render different file types
  const renderFileContent = () => {
    const { url, fileType } = fileData;

    // PDF files
    if (fileType === 'application/pdf') {
      return (
        <div className="relative w-full min-h-[842px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          <Document
            file={url}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
            error={
              <div className="flex items-center justify-center h-full text-red-500">
                Failed to load PDF document
              </div>
            }
          >
            <Page 
              pageNumber={currentPage} 
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      );
    }
    
    // Image files
    if (fileType.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center">
          <img 
            src={url} 
            alt="Document" 
            className="max-w-full max-h-[842px] object-contain"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      );
    }
    
    // Word documents and other file types
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-10 h-10 text-indigo-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {fileData.fileName}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
            ? 'Microsoft Word Document' 
            : fileType}
        </p>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => window.open(url, '_blank')}
        >
          Download Document
        </Button>
      </div>
    );
  };

  return (
    <div className={`file-viewer-container space-y-4 ${className}`}>
      {fileData.fileType === 'application/pdf' && (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {numPages || '?'}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === numPages}
            >
              Next
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setScale(scale - 0.1)}
              disabled={scale <= 0.5}
            >
              -
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setScale(scale + 0.1)}
              disabled={scale >= 2.0}
            >
              +
            </Button>
          </div>
        </div>
      )}
      
      <Card className="document-page relative">
        <CardContent className="p-0 overflow-hidden">
          {renderFileContent()}
        </CardContent>
      </Card>
      
      {fileData.fileType === 'application/pdf' && numPages && numPages > 1 && (
        <div className="flex justify-center space-x-1 mt-4 flex-wrap gap-1">
          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
} 