'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RecipientSuggestionProps {
  documentId: string;
  onRecipientsSelected?: (recipients: string[]) => void;
}

export function RecipientSuggestion({ documentId, onRecipientsSelected }: RecipientSuggestionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedRecipients, setSuggestedRecipients] = useState<{email: string; role: string; selected: boolean}[]>([]);
  const [customEmail, setCustomEmail] = useState('');

  // Simulate AI recipient suggestion
  const suggestRecipients = async () => {
    setIsAnalyzing(true);
    
    // In a real implementation, this would call the AI recipient suggestion API
    // For demo purposes, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockRecipients = [
      { email: 'legal@company.com', role: 'Legal Department', selected: true },
      { email: 'ceo@company.com', role: 'CEO', selected: false },
      { email: 'partner@example.com', role: 'Business Partner', selected: true },
      { email: 'finance@company.com', role: 'Finance Department', selected: false },
    ];
    
    setSuggestedRecipients(mockRecipients);
    setIsAnalyzing(false);
  };

  const toggleRecipient = (index: number) => {
    const updated = [...suggestedRecipients];
    updated[index].selected = !updated[index].selected;
    setSuggestedRecipients(updated);
  };

  const addCustomRecipient = () => {
    if (customEmail && customEmail.includes('@')) {
      setSuggestedRecipients([
        ...suggestedRecipients,
        { email: customEmail, role: 'Custom', selected: true }
      ]);
      setCustomEmail('');
    }
  };

  const confirmRecipients = () => {
    if (onRecipientsSelected) {
      const selectedEmails = suggestedRecipients
        .filter(r => r.selected)
        .map(r => r.email);
      onRecipientsSelected(selectedEmails);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Smart Recipient Suggestions</CardTitle>
        <CardDescription>
          Our AI will analyze your document and suggest appropriate recipients
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-center text-muted-foreground">
              Analyzing document content...
            </p>
            <p className="text-xs text-center text-muted-foreground">
              Our AI is identifying potential recipients based on document content and context
            </p>
          </div>
        ) : suggestedRecipients.length > 0 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Suggested Recipients</h3>
              <div className="space-y-2">
                {suggestedRecipients.map((recipient, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-md flex items-center justify-between cursor-pointer transition-colors ${
                      recipient.selected ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => toggleRecipient(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{recipient.email[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{recipient.email}</p>
                        <p className="text-xs text-muted-foreground">{recipient.role}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      recipient.selected ? 'bg-primary border-primary' : 'border-input'
                    }`}>
                      {recipient.selected && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Add Custom Recipient</h3>
              <div className="flex space-x-2">
                <Input 
                  placeholder="email@example.com" 
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                />
                <Button variant="outline" onClick={addCustomRecipient}>Add</Button>
              </div>
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <p className="text-center">
              Click the button below to get AI-suggested recipients for your document
            </p>
            <Button onClick={suggestRecipients}>
              Suggest Recipients
            </Button>
          </div>
        )}
      </CardContent>
      {suggestedRecipients.length > 0 && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => {
            setSuggestedRecipients([]);
          }}>
            Reset
          </Button>
          <Button onClick={confirmRecipients}>
            Confirm Recipients
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default RecipientSuggestion;
