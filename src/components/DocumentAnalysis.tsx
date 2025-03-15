'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DocumentAnalysisProps {
  documentId: string;
  onAnalysisComplete?: (fields: any) => void;
}

export function DocumentAnalysis({ documentId, onAnalysisComplete }: DocumentAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [detectedFields, setDetectedFields] = useState<any[]>([]);
  const [documentSummary, setDocumentSummary] = useState<string>('');
  const [suggestedRecipients, setSuggestedRecipients] = useState<string[]>([]);

  // Simulate AI analysis process
  const analyzeDocument = async () => {
    setIsAnalyzing(true);
    
    // In a real implementation, this would call the AI analysis API
    // For demo purposes, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockFields = [
      { type: 'signature', page: 1, x: 100, y: 500, required: true, label: 'Signature' },
      { type: 'date', page: 1, x: 400, y: 500, required: true, label: 'Date' },
      { type: 'text', page: 1, x: 100, y: 300, required: false, label: 'Name' },
      { type: 'text', page: 1, x: 400, y: 300, required: false, label: 'Title' },
    ];
    
    const mockSummary = "This document is a standard non-disclosure agreement (NDA) between two parties. It contains provisions for protecting confidential information, defines the scope of confidentiality, and outlines the terms of the agreement including duration and termination conditions.";
    
    const mockRecipients = [
      'legal@company.com',
      'partner@example.com',
    ];
    
    setDetectedFields(mockFields);
    setDocumentSummary(mockSummary);
    setSuggestedRecipients(mockRecipients);
    setAnalysisComplete(true);
    setIsAnalyzing(false);
    
    if (onAnalysisComplete) {
      onAnalysisComplete(mockFields);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Document Analysis</CardTitle>
        <CardDescription>
          Use AI to analyze your document and automatically detect fields, generate a summary, and suggest recipients
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!analysisComplete ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-center text-muted-foreground">
                  Analyzing document content...
                </p>
                <p className="text-xs text-center text-muted-foreground">
                  Our AI is scanning your document to identify signature fields, key information, and potential recipients
                </p>
              </>
            ) : (
              <>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-12 w-12 text-primary/60"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M9 15v-6" />
                  <path d="M12 12v3" />
                  <path d="M15 9v6" />
                </svg>
                <p className="text-center">
                  Click the button below to analyze your document with AI
                </p>
                <Button onClick={analyzeDocument}>
                  Analyze Document
                </Button>
              </>
            )}
          </div>
        ) : (
          <Tabs defaultValue="fields" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fields">Detected Fields</TabsTrigger>
              <TabsTrigger value="summary">Document Summary</TabsTrigger>
              <TabsTrigger value="recipients">Suggested Recipients</TabsTrigger>
            </TabsList>
            <TabsContent value="fields" className="space-y-4 py-4">
              <div className="space-y-2">
                {detectedFields.map((field, index) => (
                  <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{field.label}</span>
                      {field.required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Page {field.page}, Position ({field.x}, {field.y})
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="summary" className="py-4">
              <div className="p-4 border rounded-md bg-secondary/30">
                <h4 className="text-sm font-medium mb-2">Document Summary</h4>
                <p className="text-sm text-muted-foreground">
                  {documentSummary}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="recipients" className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Based on the document content, we suggest the following recipients:
                </p>
                {suggestedRecipients.map((email, index) => (
                  <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                    <span className="text-sm">{email}</span>
                    <Button size="sm" variant="outline">Add</Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {analysisComplete && (
          <>
            <Button variant="outline" onClick={() => {
              setAnalysisComplete(false);
              setDetectedFields([]);
              setDocumentSummary('');
              setSuggestedRecipients([]);
            }}>
              Reset Analysis
            </Button>
            <Button>
              Apply Suggestions
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default DocumentAnalysis;
