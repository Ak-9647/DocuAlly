import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Send, UserPlus, FileText, CheckCircle, Mail, AlertCircle } from 'lucide-react';
import { SignaturePad } from '@/components/SignaturePad';
import { sendSignedNotification, sendSigningReminder, trackEmailSent } from '@/lib/email';

interface Recipient {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'signed' | 'declined';
  signatureData?: string;
  signedAt?: string;
}

interface DocumentSigningProps {
  documentId: string;
  documentUrl: string;
  documentName: string;
  isOwner?: boolean;
  currentUserEmail?: string;
}

export function DocumentSigning({
  documentId,
  documentUrl,
  documentName,
  isOwner = false,
  currentUserEmail
}: DocumentSigningProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState<Recipient | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [sendingStatus, setSendingStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [remindersSent, setRemindersSent] = useState<Record<string, boolean>>({});
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [showEmailLogs, setShowEmailLogs] = useState(false);

  // Simulate fetching document recipients
  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockRecipients: Recipient[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            status: 'signed',
            signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAA...',
            signedAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            status: 'pending'
          },
          {
            id: '3',
            name: 'Current User',
            email: currentUserEmail || 'user@example.com',
            status: 'pending'
          }
        ];
        
        setRecipients(mockRecipients);
        setError(null);
      } catch (err) {
        setError('Failed to load recipients');
        console.error('Error fetching recipients:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipients();
  }, [currentUserEmail]);

  const handleAddRecipient = () => {
    // In a real app, this would open a modal to add a new recipient
    const newRecipient: Recipient = {
      id: `new-${Date.now()}`,
      name: 'New Recipient',
      email: 'new@example.com',
      status: 'pending'
    };
    
    setRecipients([...recipients, newRecipient]);
  };

  const handleSignDocument = (recipient: Recipient) => {
    setCurrentRecipient(recipient);
    setShowSignatureModal(true);
  };

  const handleSaveSignature = async (data: string) => {
    setSignatureData(data);
    setShowSignatureModal(false);
    
    // Update the recipient's signature
    if (currentRecipient) {
      const updatedRecipients = recipients.map(r => 
        r.id === currentRecipient.id 
          ? { 
              ...r, 
              status: 'signed' as const, 
              signatureData: data,
              signedAt: new Date().toISOString()
            } 
          : r
      );
      
      setRecipients(updatedRecipients);
      
      try {
        // In a real app, you would save the signature to the database here
        
        // Send email notification to the document owner
        if (isOwner === false) {
          // If the current user is not the owner, notify the owner
          // In a real app, you would get the owner's email from the database
          const ownerEmail = 'owner@example.com'; // Placeholder
          const viewLink = `${window.location.origin}/documents/${documentId}`;
          
          const result = await sendSignedNotification({
            to: ownerEmail,
            documentName,
            signerName: currentRecipient.name,
            viewLink,
            recipientName: 'Document Owner' // In a real app, this would be the owner's name
          });
          
          // Track the email sending
          await trackEmailSent('signed', ownerEmail, documentId, true);
          
          // Add to email logs
          setEmailLogs(prev => [
            ...prev,
            {
              id: `log_${Date.now()}`,
              type: 'signed',
              to: ownerEmail,
              timestamp: new Date().toISOString(),
              status: 'sent',
              subject: `${currentRecipient.name} has signed ${documentName}`
            }
          ]);
        }
        
        // Check if all recipients have signed
        const allSigned = updatedRecipients.every(r => r.status === 'signed');
        
        if (allSigned) {
          // If all recipients have signed, notify all participants
          for (const recipient of updatedRecipients) {
            if (recipient.email !== currentUserEmail) {
              try {
                const viewLink = `${window.location.origin}/documents/${documentId}`;
                
                const result = await sendSignedNotification({
                  to: recipient.email,
                  documentName,
                  signerName: 'All parties',
                  viewLink,
                  recipientName: recipient.name,
                  isFullyCompleted: true
                });
                
                // Track the email sending
                await trackEmailSent('completed', recipient.email, documentId, true);
                
                // Add to email logs
                setEmailLogs(prev => [
                  ...prev,
                  {
                    id: `log_${Date.now()}_${recipient.id}`,
                    type: 'completed',
                    to: recipient.email,
                    timestamp: new Date().toISOString(),
                    status: 'sent',
                    subject: `Document fully signed: ${documentName}`
                  }
                ]);
              } catch (error) {
                console.error(`Failed to send completion notification to ${recipient.email}:`, error);
                
                // Track the failed email
                await trackEmailSent('completed', recipient.email, documentId, false);
                
                // Add to email logs
                setEmailLogs(prev => [
                  ...prev,
                  {
                    id: `log_${Date.now()}_${recipient.id}`,
                    type: 'completed',
                    to: recipient.email,
                    timestamp: new Date().toISOString(),
                    status: 'failed',
                    subject: `Document fully signed: ${documentName}`,
                    error: (error as Error).message
                  }
                ]);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error sending signature notification:', error);
        
        // Add to email logs
        setEmailLogs(prev => [
          ...prev,
          {
            id: `log_${Date.now()}_error`,
            type: 'signed',
            to: 'owner@example.com',
            timestamp: new Date().toISOString(),
            status: 'failed',
            subject: `${currentRecipient.name} has signed ${documentName}`,
            error: (error as Error).message
          }
        ]);
      }
      
      setCurrentRecipient(null);
    }
  };

  const handleSendReminders = async () => {
    setSendingStatus('sending');
    
    try {
      // Get pending recipients
      const pendingRecipients = recipients.filter(r => r.status === 'pending');
      
      if (pendingRecipients.length === 0) {
        setSendingStatus('sent');
        setTimeout(() => setSendingStatus('idle'), 3000);
        return;
      }
      
      // Send reminders to all pending recipients
      for (const recipient of pendingRecipients) {
        try {
          // Generate signing link
          const signLink = `${window.location.origin}/documents/${documentId}?recipient=${recipient.id}`;
          
          // Send reminder
          await sendSigningReminder({
            to: recipient.email,
            documentName,
            senderName: 'DocuAlly User', // In a real app, this would be the current user's name
            signLink,
            recipientName: recipient.name
          });
          
          // Track the email sending
          await trackEmailSent('reminder', recipient.email, documentId, true);
          
          // Mark reminder as sent
          setRemindersSent(prev => ({
            ...prev,
            [recipient.id]: true
          }));
          
          // Add to email logs
          setEmailLogs(prev => [
            ...prev,
            {
              id: `log_${Date.now()}_${recipient.id}`,
              type: 'reminder',
              to: recipient.email,
              timestamp: new Date().toISOString(),
              status: 'sent',
              subject: `Reminder: Please sign ${documentName}`
            }
          ]);
        } catch (error) {
          console.error(`Failed to send reminder to ${recipient.email}:`, error);
          
          // Track the failed email
          await trackEmailSent('reminder', recipient.email, documentId, false);
          
          // Add to email logs
          setEmailLogs(prev => [
            ...prev,
            {
              id: `log_${Date.now()}_${recipient.id}`,
              type: 'reminder',
              to: recipient.email,
              timestamp: new Date().toISOString(),
              status: 'failed',
              subject: `Reminder: Please sign ${documentName}`,
              error: (error as Error).message
            }
          ]);
        }
      }
      
      setSendingStatus('sent');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSendingStatus('idle');
      }, 3000);
    } catch (err) {
      setSendingStatus('error');
      console.error('Error sending reminders:', err);
    }
  };

  const toggleEmailLogs = async () => {
    setShowEmailLogs(!showEmailLogs);
    
    // In a real app, you would fetch email logs from the server
    if (!showEmailLogs && emailLogs.length === 0) {
      try {
        // Simulate API call to fetch email logs
        const response = await fetch(`/api/email/track?documentId=${documentId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setEmailLogs(data.data);
        }
      } catch (error) {
        console.error('Error fetching email logs:', error);
      }
    }
  };

  const getCurrentUserRecipient = () => {
    return recipients.find(r => r.email === currentUserEmail);
  };

  const getPendingRecipients = () => {
    return recipients.filter(r => r.status === 'pending');
  };

  const getSignedRecipients = () => {
    return recipients.filter(r => r.status === 'signed');
  };

  const isDocumentFullySigned = () => {
    return recipients.every(r => r.status === 'signed');
  };

  const canCurrentUserSign = () => {
    const currentUserRecipient = getCurrentUserRecipient();
    return currentUserRecipient && currentUserRecipient.status === 'pending';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Document: {documentName}</span>
            {isDocumentFullySigned() && (
              <span className="flex items-center text-green-600 text-sm font-normal">
                <CheckCircle className="h-4 w-4 mr-1" />
                Completed
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <iframe 
              src={documentUrl} 
              className="w-full h-[500px] border border-gray-200 rounded-md"
              title="Document Preview"
            />
          </div>
          
          <Tabs defaultValue="recipients">
            <TabsList className="mb-4">
              <TabsTrigger value="recipients">Recipients</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              {isOwner && <TabsTrigger value="emails">Email Logs</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="recipients">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recipients</h3>
                  {isOwner && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddRecipient}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Recipient
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {recipients.map(recipient => (
                    <div 
                      key={recipient.id} 
                      className="flex justify-between items-center p-3 border border-gray-200 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{recipient.name}</p>
                        <p className="text-sm text-gray-500">{recipient.email}</p>
                      </div>
                      <div className="flex items-center">
                        {recipient.status === 'signed' ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span>Signed</span>
                          </div>
                        ) : (
                          <>
                            {recipient.email === currentUserEmail ? (
                              <Button 
                                size="sm" 
                                onClick={() => handleSignDocument(recipient)}
                              >
                                Sign Now
                              </Button>
                            ) : (
                              <span className="text-amber-600 text-sm">Pending</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {isOwner && getPendingRecipients().length > 0 && (
                  <div className="mt-4">
                    <Button 
                      onClick={handleSendReminders}
                      disabled={sendingStatus === 'sending'}
                      variant="outline"
                      className="w-full"
                    >
                      {sendingStatus === 'sending' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending Reminders...
                        </>
                      ) : sendingStatus === 'sent' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Reminders Sent
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Reminders to Pending Recipients
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Document Activity</h3>
                
                <div className="space-y-2">
                  {recipients.map(recipient => (
                    <div 
                      key={recipient.id}
                      className="p-3 border border-gray-200 rounded-md flex items-center"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{recipient.name}</div>
                        <div className="text-sm text-gray-500">{recipient.email}</div>
                      </div>
                      <div className="flex items-center">
                        {recipient.status === 'signed' ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span>Signed</span>
                            {recipient.signedAt && (
                              <span className="ml-2 text-xs text-gray-500">
                                {new Date(recipient.signedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>Pending</span>
                            {remindersSent[recipient.id] && (
                              <span className="ml-2 text-xs text-gray-500">
                                Reminder sent
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Completion Status</h4>
                      <p className="text-sm text-gray-500">
                        {getSignedRecipients().length} of {recipients.length} signatures completed
                      </p>
                    </div>
                    <div className="w-24 h-24 relative">
                      <svg className="w-24 h-24" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={isDocumentFullySigned() ? "#10b981" : "#f59e0b"}
                          strokeWidth="10"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - getSignedRecipients().length / recipients.length)}
                          transform="rotate(-90 50 50)"
                        />
                        <text
                          x="50"
                          y="50"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="20"
                          fontWeight="bold"
                          fill={isDocumentFullySigned() ? "#10b981" : "#f59e0b"}
                        >
                          {Math.round((getSignedRecipients().length / recipients.length) * 100)}%
                        </text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="emails">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={toggleEmailLogs}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {showEmailLogs ? "Hide Logs" : "Show Logs"}
                  </Button>
                </div>
                
                {showEmailLogs ? (
                  emailLogs.length > 0 ? (
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {emailLogs.map(log => (
                            <tr key={log.id}>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  log.type === 'invite' ? 'bg-blue-100 text-blue-800' :
                                  log.type === 'reminder' ? 'bg-amber-100 text-amber-800' :
                                  log.type === 'signed' ? 'bg-green-100 text-green-800' :
                                  'bg-purple-100 text-purple-800'
                                }`}>
                                  {log.type === 'invite' ? 'Invitation' :
                                   log.type === 'reminder' ? 'Reminder' :
                                   log.type === 'signed' ? 'Signature' :
                                   'Completion'}
                                </span>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{log.to}</td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  log.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {log.status === 'sent' ? 'Sent' : 'Failed'}
                                </span>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-4 border border-gray-200 rounded-md">
                      <p className="text-gray-500">No email logs found for this document.</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-md">
                      <h4 className="font-medium mb-2">Automatic Notifications</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span>Recipients are notified when they need to sign the document</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span>Document owner is notified when a recipient signs</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span>All parties are notified when the document is fully signed</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-md">
                      <h4 className="font-medium mb-2">Manual Reminders</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Send reminders to recipients who haven't signed the document yet.
                      </p>
                      <Button 
                        onClick={handleSendReminders}
                        disabled={sendingStatus === 'sending' || getPendingRecipients().length === 0}
                        variant="outline"
                        className="w-full"
                      >
                        {sendingStatus === 'sending' ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending Reminders...
                          </>
                        ) : sendingStatus === 'sent' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            Reminders Sent
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminders
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-1" />
            Download
          </Button>
          
          {canCurrentUserSign() && (
            <Button onClick={() => handleSignDocument(getCurrentUserRecipient()!)}>
              Sign Document
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Sign Document</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Draw your signature below:
              </p>
              <SignaturePad 
                onSave={handleSaveSignature}
                width={350}
                height={200}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowSignatureModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 