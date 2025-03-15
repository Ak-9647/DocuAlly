'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DocumentSummaryProps {
  documentId: string;
  documentContent?: string;
}

export function DocumentSummary({ documentId, documentContent }: DocumentSummaryProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [riskAreas, setRiskAreas] = useState<{text: string, severity: 'low' | 'medium' | 'high'}[]>([]);

  // Simulate AI summary generation
  const generateSummary = async () => {
    setIsGenerating(true);
    
    // In a real implementation, this would call the AI summary generation API
    // For demo purposes, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockSummary = "This document is a standard non-disclosure agreement (NDA) between two parties. It contains provisions for protecting confidential information, defines the scope of confidentiality, and outlines the terms of the agreement including duration and termination conditions.";
    
    const mockKeyPoints = [
      "Confidential information includes all non-public data shared between parties",
      "Agreement duration is 2 years from the effective date",
      "Each party must protect information with reasonable care",
      "Excludes information that becomes publicly available through no fault of receiving party",
      "Governing law is the state of California"
    ];
    
    const mockRiskAreas = [
      { text: "No specific remedies for breach are defined", severity: 'medium' },
      { text: "Definition of confidential information is very broad", severity: 'low' },
      { text: "No explicit provisions for return of confidential information", severity: 'high' }
    ];
    
    setSummary(mockSummary);
    setKeyPoints(mockKeyPoints);
    setRiskAreas(mockRiskAreas);
    setIsGenerating(false);
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Document Summary</CardTitle>
        <CardDescription>
          Get an AI-generated summary of your document with key points and potential risk areas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-center text-muted-foreground">
              Analyzing document content...
            </p>
            <p className="text-xs text-center text-muted-foreground">
              Our AI is reading and understanding your document to generate a comprehensive summary
            </p>
          </div>
        ) : summary ? (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="keypoints">Key Points</TabsTrigger>
              <TabsTrigger value="risks">Risk Areas</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="py-4">
              <div className="p-4 border rounded-md bg-secondary/30">
                <h4 className="text-sm font-medium mb-2">Document Summary</h4>
                <p className="text-sm text-muted-foreground">
                  {summary}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="keypoints" className="py-4">
              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-2">Key Points</h4>
                <ul className="space-y-2">
                  {keyPoints.map((point, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="risks" className="py-4">
              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-2">Potential Risk Areas</h4>
                <div className="space-y-2">
                  {riskAreas.map((risk, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{risk.text}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(risk.severity)}`}>
                        {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} risk
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
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
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            <p className="text-center">
              Click the button below to generate an AI summary of your document
            </p>
            <Button onClick={generateSummary}>
              Generate Summary
            </Button>
          </div>
        )}
      </CardContent>
      {summary && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => {
            setSummary('');
            setKeyPoints([]);
            setRiskAreas([]);
          }}>
            Reset
          </Button>
          <Button>
            Save Summary
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default DocumentSummary;
