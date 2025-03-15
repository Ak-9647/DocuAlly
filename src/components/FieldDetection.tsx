'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FieldDetectionProps {
  documentId: string;
  onFieldsDetected?: (fields: any[]) => void;
}

export function FieldDetection({ documentId, onFieldsDetected }: FieldDetectionProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectedFields, setDetectedFields] = useState<any[]>([]);

  // Simulate AI field detection process
  const detectFields = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // In a real implementation, this would call the AI field detection API
    // For demo purposes, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockFields = [
      { 
        type: 'signature', 
        page: 1, 
        x: 100, 
        y: 500, 
        width: 150, 
        height: 50,
        required: true, 
        label: 'Signature',
        confidence: 0.95
      },
      { 
        type: 'date', 
        page: 1, 
        x: 400, 
        y: 500, 
        width: 100, 
        height: 30,
        required: true, 
        label: 'Date',
        confidence: 0.92
      },
      { 
        type: 'text', 
        page: 1, 
        x: 100, 
        y: 300, 
        width: 200, 
        height: 30,
        required: false, 
        label: 'Name',
        confidence: 0.88
      },
      { 
        type: 'text', 
        page: 1, 
        x: 400, 
        y: 300, 
        width: 200, 
        height: 30,
        required: false, 
        label: 'Title',
        confidence: 0.85
      },
      { 
        type: 'checkbox', 
        page: 2, 
        x: 100, 
        y: 200, 
        width: 20, 
        height: 20,
        required: true, 
        label: 'Agreement',
        confidence: 0.90
      },
    ];
    
    clearInterval(interval);
    setProgress(100);
    
    // Short delay to show 100% completion
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDetectedFields(mockFields);
    setIsProcessing(false);
    
    if (onFieldsDetected) {
      onFieldsDetected(mockFields);
    }
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'signature':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 20h.01"></path>
            <path d="M7 20v-4"></path>
            <path d="M12 20v-8"></path>
            <path d="M17 20V8"></path>
            <path d="M22 4v16"></path>
          </svg>
        );
      case 'date':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
          </svg>
        );
      case 'checkbox':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="21" x2="3" y1="6" y2="6"></line>
            <line x1="15" x2="3" y1="12" y2="12"></line>
            <line x1="17" x2="3" y1="18" y2="18"></line>
          </svg>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Smart Field Detection</CardTitle>
        <CardDescription>
          Our AI will analyze your document and automatically detect signature fields, dates, and other form elements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isProcessing ? (
          <div className="space-y-4 py-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Analyzing document...</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground mt-2">
              <p>Our AI is scanning your document to identify form fields:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Detecting signature areas</li>
                <li>Identifying date fields</li>
                <li>Recognizing text input fields</li>
                <li>Finding checkboxes and option fields</li>
              </ul>
            </div>
          </div>
        ) : detectedFields.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Detected Fields</h3>
            <div className="space-y-2">
              {detectedFields.map((field, index) => (
                <div key={index} className="p-3 border rounded-md flex items-center">
                  <div className="mr-3 text-primary">
                    {getFieldIcon(field.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{field.label}</span>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                        {Math.round(field.confidence * 100)}% confidence
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Page {field.page} • {field.type} • 
                      {field.required ? ' Required' : ' Optional'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              <rect x="8" y="12" width="8" height="6" rx="1" />
            </svg>
            <p className="text-center">
              Click the button below to automatically detect fields in your document
            </p>
            <Button onClick={detectFields}>
              Detect Fields
            </Button>
          </div>
        )}
      </CardContent>
      {detectedFields.length > 0 && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => {
            setDetectedFields([]);
          }}>
            Reset
          </Button>
          <Button>
            Apply Fields
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default FieldDetection;
