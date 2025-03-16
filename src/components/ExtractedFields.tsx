'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileSearch, AlertCircle, CheckCircle2, Copy } from 'lucide-react';

interface ExtractedField {
  name: string;
  value: string;
  confidence: number;
}

interface ExtractedFieldsProps {
  documentId: string;
  documentContent?: string;
  onFieldsExtracted?: (fields: ExtractedField[]) => void;
}

export function ExtractedFields({ documentId, documentContent = '', onFieldsExtracted }: ExtractedFieldsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const extractFields = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the AI field extraction API
      const response = await fetch('/api/ai/extract-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, documentContent }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to extract fields');
      }
      
      if (data.success && data.extractedFields) {
        setExtractedFields(data.extractedFields);
        setSuccess(true);
        
        if (onFieldsExtracted) {
          onFieldsExtracted(data.extractedFields);
        }
      } else {
        throw new Error('No fields extracted');
      }
    } catch (err) {
      console.error('Field extraction error:', err);
      setError((err as Error).message || 'Failed to extract fields. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  const copyFieldsToClipboard = () => {
    const text = extractedFields
      .map(field => `${field.name}: ${field.value}`)
      .join('\n');
      
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Fields copied to clipboard!');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileSearch className="w-5 h-5 mr-2 text-indigo-600" />
          AI Field Extraction
        </CardTitle>
        <CardDescription>
          Automatically extract key fields and data from your document
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {extractedFields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="text-sm text-gray-500">Analyzing document and extracting fields...</p>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-gray-600">
                  Extract key information from your document automatically using AI
                </p>
                <Button
                  onClick={extractFields}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Extract Fields
                </Button>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start w-full">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                <p className="text-sm text-green-800">
                  Successfully extracted {extractedFields.length} fields from your document
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Extracted Fields:</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyFieldsToClipboard}
                  className="flex items-center text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy All
                </Button>
              </div>
              
              <div className="space-y-2">
                {extractedFields.map((field, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-gray-50 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <div className="text-sm font-medium">{field.name}</div>
                      <div className="text-sm text-gray-600">{field.value}</div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getConfidenceColor(field.confidence)}`}
                    >
                      {Math.round(field.confidence * 100)}% confidence
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {extractedFields.length > 0 && (
        <CardFooter className="flex justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setExtractedFields([]);
              setSuccess(false);
            }}
          >
            Reset
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={extractFields}
          >
            Re-extract Fields
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 