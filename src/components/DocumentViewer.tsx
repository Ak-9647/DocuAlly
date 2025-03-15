'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DocumentViewerProps {
  documentUrl: string;
  totalPages: number;
  onAddSignature?: (page: number, x: number, y: number) => void;
}

export function DocumentViewer({ documentUrl, totalPages, onAddSignature }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [signingMode, setSigningMode] = useState(false);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDocumentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!signingMode || !onAddSignature) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    onAddSignature(currentPage, x, y);
    setSigningMode(false);
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="document-viewer-container space-y-4">
      <Tabs defaultValue="document" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="document">Document</TabsTrigger>
          <TabsTrigger value="fields">Fields</TabsTrigger>
        </TabsList>
        <TabsContent value="document" className="space-y-4">
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
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            
            {onAddSignature && (
              <Button 
                variant={signingMode ? "default" : "outline"} 
                size="sm"
                onClick={() => setSigningMode(!signingMode)}
              >
                {signingMode ? "Cancel Signing" : "Add Signature"}
              </Button>
            )}
          </div>
          
          <Card className={`document-page relative ${signingMode ? 'cursor-crosshair' : ''}`}>
            <CardContent className="p-0 overflow-hidden">
              <div 
                className="relative w-full min-h-[842px]" 
                onClick={handleDocumentClick}
              >
                {/* This would be replaced with an actual PDF renderer in a real implementation */}
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
                  <img 
                    src={documentUrl || '/placeholder-document.png'} 
                    alt={`Document page ${currentPage}`}
                    className="max-w-full max-h-full object-contain"
                  />
                  {signingMode && (
                    <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                      <p className="text-primary font-medium">Click anywhere to place your signature</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {totalPages > 1 && (
            <div className="flex justify-center space-x-1 mt-4">
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
        </TabsContent>
        <TabsContent value="fields">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-medium">Document Fields</h3>
              <p className="text-sm text-muted-foreground">
                AI-detected fields will appear here. You can add signatures, dates, and other fields to your document.
              </p>
              <div className="space-y-2">
                <div className="p-3 border rounded-md flex justify-between items-center">
                  <span className="text-sm">Signature (Required)</span>
                  <Button size="sm" variant="outline">Add</Button>
                </div>
                <div className="p-3 border rounded-md flex justify-between items-center">
                  <span className="text-sm">Date (Required)</span>
                  <Button size="sm" variant="outline">Add</Button>
                </div>
                <div className="p-3 border rounded-md flex justify-between items-center">
                  <span className="text-sm">Name (Optional)</span>
                  <Button size="sm" variant="outline">Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DocumentViewer;
