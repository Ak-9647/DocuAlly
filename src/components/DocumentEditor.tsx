'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentSummary } from '@/components/DocumentSummary';
import { ExtractedFields } from '@/components/ExtractedFields';
import { RecipientSuggestion } from '@/components/RecipientSuggestion';
import { FieldDetection } from '@/components/FieldDetection';
import { SignaturePad } from '@/components/SignaturePad';
import { DocumentViewer } from '@/components/DocumentViewer';
import { FileText, Users, PenTool, Sparkles, Save, Send } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface SignatureFieldData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  label: string;
  required: boolean;
  recipientId?: string;
}

interface DocumentEditorProps {
  documentId: string;
  documentName?: string;
  documentContent?: string;
  documentUrl?: string;
}

export function DocumentEditor({ 
  documentId, 
  documentName = 'Untitled Document', 
  documentContent = '',
  documentUrl = '/placeholder-document.pdf'
}: DocumentEditorProps) {
  const [activeTab, setActiveTab] = useState('edit');
  const [documentSummary, setDocumentSummary] = useState<string>('');
  const [extractedFields, setExtractedFields] = useState<any[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<any[]>([]);
  const [detectedFields, setDetectedFields] = useState<any[]>([]);
  const [signatureFields, setSignatureFields] = useState<SignatureFieldData[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Convert string ID to Convex ID
  const convexDocId = documentId ? Id.fromString(documentId) : null;

  // Fetch signature fields from the database
  const dbSignatureFields = useQuery(
    api.signatureFields.getByDocumentId, 
    convexDocId ? { documentId: convexDocId } : "skip"
  );

  // Mutation to update signature fields
  const updateSignatureFields = useMutation(api.signatureFields.batchUpdate);

  // Mock document content for preview
  const [previewContent, setPreviewContent] = useState<string>(
    documentContent || 
    `This is a sample document content. In a real implementation, this would be the actual document content loaded from the server.
    
    The document would be displayed here with all formatting preserved. Users would be able to view and interact with the document.
    
    Any fields that need to be filled would be highlighted and interactive.`
  );

  // Convert database signature fields to component format
  useEffect(() => {
    if (dbSignatureFields) {
      const fields = dbSignatureFields.map(field => ({
        id: field.fieldId,
        x: field.x,
        y: field.y,
        width: field.width,
        height: field.height,
        page: field.page,
        label: field.label,
        required: field.required,
        recipientId: field.recipientId
      }));
      setSignatureFields(fields);
    }
  }, [dbSignatureFields]);

  const handleSignatureFieldsChange = async (fields: SignatureFieldData[]) => {
    setSignatureFields(fields);
    
    // Don't save to database immediately - we'll do that when the document is saved
  };

  const handleSaveDocument = async () => {
    setIsSaving(true);
    
    if (convexDocId) {
      try {
        // Save signature fields to the database
        await updateSignatureFields({
          documentId: convexDocId,
          fields: signatureFields.map(field => ({
            fieldId: field.id,
            x: field.x,
            y: field.y,
            width: field.width,
            height: field.height,
            page: field.page,
            label: field.label,
            required: field.required,
            recipientId: field.recipientId
          }))
        });
        
        setSaveSuccess(true);
      } catch (error) {
        console.error('Error saving document:', error);
        alert('Failed to save document. Please try again.');
      }
    }
    
    setIsSaving(false);
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleSendDocument = async () => {
    if (selectedRecipients.length === 0) {
      alert('Please select at least one recipient before sending.');
      setActiveTab('recipients');
      return;
    }
    
    setIsSending(true);
    
    // Simulate API call to send document
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSendSuccess(true);
    setIsSending(false);
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setSendSuccess(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{documentName}</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSaveDocument}
            disabled={isSaving}
            className="flex items-center"
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
          <Button 
            onClick={handleSendDocument}
            disabled={isSending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"
          >
            {isSending ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send for Signature
              </>
            )}
          </Button>
        </div>
      </div>
      
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p className="text-sm text-green-800">Document saved successfully!</p>
        </div>
      )}
      
      {sendSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p className="text-sm text-green-800">Document sent for signature to {selectedRecipients.length} recipient(s)!</p>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="edit" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Document</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">AI Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="fields" className="flex items-center">
            <PenTool className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Fields</span>
          </TabsTrigger>
          <TabsTrigger value="recipients" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Recipients</span>
          </TabsTrigger>
          <TabsTrigger value="sign" className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            <span className="hidden sm:inline">Sign</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-4">
          <DocumentViewer 
            documentUrl={documentUrl}
            signatureFields={signatureFields}
            onSignatureFieldsChange={handleSignatureFieldsChange}
          />
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6">
          <DocumentSummary 
            documentId={documentId} 
            documentContent={documentContent}
            onSummaryGenerated={setDocumentSummary}
          />
          <ExtractedFields 
            documentId={documentId} 
            documentContent={documentContent}
            onFieldsExtracted={setExtractedFields}
          />
        </TabsContent>
        
        <TabsContent value="fields" className="space-y-4">
          <FieldDetection 
            documentId={documentId}
            onFieldsDetected={setDetectedFields}
          />
        </TabsContent>
        
        <TabsContent value="recipients" className="space-y-4">
          <RecipientSuggestion 
            documentId={documentId}
            documentContent={documentContent}
            onRecipientsSelected={setSelectedRecipients}
          />
        </TabsContent>
        
        <TabsContent value="sign" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Sign Document</h3>
                <p className="text-gray-600">
                  Draw your signature below to sign this document
                </p>
                <SignaturePad />
                <div className="flex justify-end">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Apply Signature
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 