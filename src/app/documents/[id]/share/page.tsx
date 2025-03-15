'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DocumentSharePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const documentId = params.id;
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sharedWith, setSharedWith] = useState<{email: string; status: string}[]>([
    { email: 'partner@example.com', status: 'pending' }
  ]);
  
  const handleAddRecipient = () => {
    if (email && !sharedWith.some(person => person.email === email)) {
      setSharedWith([...sharedWith, { email, status: 'pending' }]);
      setEmail('');
    }
  };
  
  const handleRemoveRecipient = (emailToRemove: string) => {
    setSharedWith(sharedWith.filter(person => person.email !== emailToRemove));
  };
  
  const handleSendInvitations = () => {
    // In a real implementation, this would send invitations to the recipients
    console.log('Sending invitations to:', sharedWith);
    console.log('With message:', message);
    
    // Redirect to dashboard
    router.push('/dashboard');
  };
  
  return (
    <ProtectedRoute>
      <div className="container max-w-screen-xl mx-auto py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Share Document</h1>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Cancel
            </Button>
          </div>
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Add Recipients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="link">Share Link</TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Recipient Email</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="email" 
                          placeholder="email@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button onClick={handleAddRecipient}>Add</Button>
                      </div>
                    </div>
                    
                    {sharedWith.length > 0 && (
                      <div className="space-y-2">
                        <Label>Recipients</Label>
                        <div className="space-y-2">
                          {sharedWith.map((person, index) => (
                            <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{person.email[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{person.email}</p>
                                  <p className="text-xs text-muted-foreground capitalize">{person.status}</p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveRecipient(person.email)}
                                className="text-destructive"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Input 
                        id="message" 
                        placeholder="Add a message to your recipients" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="link" className="space-y-6 py-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Create a link that you can share with anyone to view and sign this document.
                    </p>
                    <div className="p-4 border rounded-md bg-secondary/30">
                      <p className="text-sm font-medium mb-2">Shareable Link</p>
                      <div className="flex space-x-2">
                        <Input 
                          readOnly 
                          value={`https://not-docusign.example.com/s/${documentId}`} 
                        />
                        <Button variant="outline">Copy</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiration">Link Expiration</Label>
                      <select 
                        id="expiration" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                        <option value="30">30 days</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSendInvitations} disabled={sharedWith.length === 0}>
              Send Invitations
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
