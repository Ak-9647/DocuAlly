'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, Zap } from 'lucide-react';

interface Field {
  id: string;
  type: string;
  page: number;
  x: number;
  y: number;
  required: boolean;
  label: string;
}

interface FieldDetectionProps {
  documentId: string;
  onFieldsDetected?: (fields: Field[]) => void;
}

export function FieldDetection({ documentId, onFieldsDetected }: FieldDetectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initial field templates
  const fieldTemplates = [
    { type: 'signature', label: 'Signature', required: true },
    { type: 'date', label: 'Date', required: true },
    { type: 'text', label: 'Name', required: false },
    { type: 'text', label: 'Title', required: false },
    { type: 'text', label: 'Company', required: false },
    { type: 'email', label: 'Email', required: false },
  ];

  const detectFields = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the AI field detection API
      const response = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to detect fields');
      }
      
      if (data.success && data.detectedFields) {
        // Add unique IDs to the fields
        const fieldsWithIds = data.detectedFields.map((field: Omit<Field, 'id'>) => ({
          ...field,
          id: Math.random().toString(36).substring(2, 9),
        }));
        
        setFields(fieldsWithIds);
        setSuccess(true);
        
        if (onFieldsDetected) {
          onFieldsDetected(fieldsWithIds);
        }
      } else {
        throw new Error('No fields detected');
      }
    } catch (err) {
      console.error('Field detection error:', err);
      setError((err as Error).message || 'Failed to detect fields. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addField = (type: string, label: string, required: boolean) => {
    const newField: Field = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      label,
      required,
      page: 1,
      x: 100,
      y: 100,
    };
    
    setFields([...fields, newField]);
    
    if (onFieldsDetected) {
      onFieldsDetected([...fields, newField]);
    }
  };

  const removeField = (id: string) => {
    const updatedFields = fields.filter(field => field.id !== id);
    setFields(updatedFields);
    
    if (onFieldsDetected) {
      onFieldsDetected(updatedFields);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="w-5 h-5 mr-2 text-indigo-600" />
          Smart Field Detection
        </CardTitle>
        <CardDescription>
          Automatically detect signature fields and form fields in your document using AI
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="text-sm text-gray-500">Analyzing document and detecting fields...</p>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-gray-600">
                  Let AI detect signature fields and form fields in your document
                </p>
                <Button
                  onClick={detectFields}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Detect Fields with AI
                </Button>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700 w-full">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                <p className="text-sm text-green-800">
                  Successfully detected {fields.length} fields in your document
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Detected Fields:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <Badge variant={field.required ? "destructive" : "secondary"} className="mr-2">
                        {field.type}
                      </Badge>
                      <span>{field.label}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(field.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Add More Fields:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {fieldTemplates.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => addField(template.type, template.label, template.required)}
                    className="text-sm"
                  >
                    + {template.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {fields.length > 0 && (
        <CardFooter className="flex justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setFields([]);
              setSuccess(false);
            }}
          >
            Reset Fields
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Apply Fields
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default FieldDetection;
