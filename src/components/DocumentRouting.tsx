import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from 'react-beautiful-dnd';
import { 
  Trash2, 
  GripVertical, 
  UserPlus, 
  Send, 
  AlertCircle,
  ArrowRight,
  Mail
} from 'lucide-react';
import { sendSigningRequest, trackEmailSent } from '@/lib/email';

interface Recipient {
  id: string;
  name: string;
  email: string;
  order: number;
}

interface DocumentRoutingProps {
  documentId: string;
  documentName: string;
  onRoutingComplete?: (recipients: Recipient[]) => void;
}

export function DocumentRouting({
  documentId,
  documentName,
  onRoutingComplete
}: DocumentRoutingProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newRecipient, setNewRecipient] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isSequential, setIsSequential] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sendingStatus, setSendingStatus] = useState<{
    success: number;
    failed: number;
    total: number;
  }>({ success: 0, failed: 0, total: 0 });
  const [message, setMessage] = useState('');
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  const handleAddRecipient = () => {
    // Validate inputs
    const newErrors: { name?: string; email?: string } = {};
    
    if (!newRecipient.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!newRecipient.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newRecipient.email)) {
      newErrors.email = 'Email is invalid';
    } else if (recipients.some(r => r.email === newRecipient.email)) {
      newErrors.email = 'Email already added';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    
    // Add new recipient
    const newRecipientWithId: Recipient = {
      id: `recipient-${Date.now()}`,
      name: newRecipient.name.trim(),
      email: newRecipient.email.trim(),
      order: recipients.length + 1
    };
    
    setRecipients([...recipients, newRecipientWithId]);
    setNewRecipient({ name: '', email: '' });
  };

  const handleRemoveRecipient = (id: string) => {
    const updatedRecipients = recipients
      .filter(r => r.id !== id)
      .map((r, index) => ({ ...r, order: index + 1 }));
    
    setRecipients(updatedRecipients);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(recipients);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setRecipients(updatedItems);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRecipient(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (recipients.length === 0) {
      setErrors({ name: 'Add at least one recipient' });
      return;
    }
    
    try {
      setIsSending(true);
      setSendingStatus({ 
        success: 0, 
        failed: 0, 
        total: recipients.length 
      });
      
      // Send emails to all recipients
      const emailPromises = recipients.map(async (recipient) => {
        try {
          // Generate a unique signing link for each recipient
          const signLink = `${window.location.origin}/documents/${documentId}?recipient=${recipient.id}`;
          
          // Get current user name (in a real app, this would come from auth)
          const senderName = 'DocuAlly User'; // In a real app, this would be the current user's name
          
          // Send email notification
          const result = await sendSigningRequest({
            to: recipient.email,
            documentName,
            senderName,
            signLink,
            recipientName: recipient.name,
            message: message || undefined
          });
          
          // Track the email sending
          await trackEmailSent('invite', recipient.email, documentId, true);
          
          setSendingStatus(prev => ({ 
            ...prev, 
            success: prev.success + 1 
          }));
          
          return { success: true, recipient, result };
        } catch (error) {
          console.error(`Failed to send email to ${recipient.email}:`, error);
          
          // Track the failed email
          await trackEmailSent('invite', recipient.email, documentId, false);
          
          setSendingStatus(prev => ({ 
            ...prev, 
            failed: prev.failed + 1 
          }));
          
          return { success: false, recipient, error };
        }
      });
      
      // Wait for all emails to be sent
      const results = await Promise.all(emailPromises);
      
      // Call the onRoutingComplete callback with the recipients
      if (onRoutingComplete) {
        onRoutingComplete(recipients);
      }
      
      // Show success message
      const successCount = results.filter(r => r.success).length;
      if (successCount === recipients.length) {
        alert(`Document sent successfully to all ${recipients.length} recipients.`);
      } else {
        alert(`Document sent to ${successCount} out of ${recipients.length} recipients. Please check the console for errors.`);
      }
    } catch (error) {
      console.error('Error sending document:', error);
      alert('An error occurred while sending the document. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const toggleEmailPreview = () => {
    setShowEmailPreview(!showEmailPreview);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Document Routing: {documentName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={isSequential ? "default" : "outline"}
              size="sm"
              onClick={() => setIsSequential(true)}
              className="flex-1"
            >
              Sequential Signing
            </Button>
            <Button
              variant={!isSequential ? "default" : "outline"}
              size="sm"
              onClick={() => setIsSequential(false)}
              className="flex-1"
            >
              Parallel Signing
            </Button>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                {isSequential 
                  ? "Recipients will sign the document in the order specified. Each recipient will be notified only after the previous recipient has signed."
                  : "All recipients will receive the document simultaneously and can sign in any order."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recipients</h3>
          
          {recipients.length > 0 && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="recipients">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {recipients.map((recipient, index) => (
                      <Draggable 
                        key={recipient.id} 
                        draggableId={recipient.id} 
                        index={index}
                        isDragDisabled={!isSequential}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center p-3 border border-gray-200 rounded-md bg-white"
                          >
                            {isSequential && (
                              <div
                                {...provided.dragHandleProps}
                                className="mr-2 text-gray-400 hover:text-gray-600"
                              >
                                <GripVertical size={18} />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-medium">{recipient.name}</div>
                              <div className="text-sm text-gray-500">{recipient.email}</div>
                            </div>
                            {isSequential && (
                              <div className="flex items-center mr-2 text-sm text-gray-500">
                                <span className="mr-1">Order:</span>
                                <span className="font-medium">{recipient.order}</span>
                              </div>
                            )}
                            <button
                              onClick={() => handleRemoveRecipient(recipient.id)}
                              className="p-1 text-gray-400 hover:text-red-500"
                              aria-label="Remove recipient"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newRecipient.name}
                onChange={handleInputChange}
                placeholder="Recipient name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newRecipient.email}
                onChange={handleInputChange}
                placeholder="Recipient email"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
          
          <Button
            onClick={handleAddRecipient}
            variant="outline"
            className="w-full"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Recipient
          </Button>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Message (Optional)</h3>
          <div>
            <Label htmlFor="message">Add a personal message to the email</Label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a message to include in the email..."
              className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <Button
            onClick={toggleEmailPreview}
            variant="outline"
            className="w-full"
          >
            <Mail className="mr-2 h-4 w-4" />
            {showEmailPreview ? "Hide Email Preview" : "Show Email Preview"}
          </Button>
          
          {showEmailPreview && (
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
              <h4 className="text-md font-medium mb-2">Email Preview</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Subject:</span> DocuAlly User has requested your signature on {documentName}
                </div>
                <div>
                  <span className="font-medium">From:</span> notifications@docually.com
                </div>
                <div>
                  <span className="font-medium">To:</span> {recipients.length > 0 ? recipients.map(r => r.email).join(', ') : '[Recipient Email]'}
                </div>
                <div className="border border-gray-200 rounded-md p-3 bg-white">
                  <div className="bg-indigo-600 p-3 text-white text-center font-bold rounded-t-md">
                    Document Signing Request
                  </div>
                  <div className="p-3">
                    <p>Hello {recipients.length > 0 ? recipients[0].name : '[Recipient Name]'},</p>
                    <p className="mt-2"><strong>DocuAlly User</strong> has requested your signature on the document: <strong>{documentName}</strong>.</p>
                    {message && <p className="mt-2">{message}</p>}
                    <p className="mt-2">Please review and sign the document at your earliest convenience.</p>
                    <div className="text-center my-4">
                      <span className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium">Review & Sign Document</span>
                    </div>
                    <p className="mt-2">If you have any questions, please contact the sender directly.</p>
                    <p className="mt-2">
                      Thank you,<br />
                      The DocuAlly Team
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {isSending && (
          <div className="w-full bg-gray-100 rounded-md p-3">
            <div className="flex justify-between mb-2">
              <span>Sending emails...</span>
              <span>{sendingStatus.success + sendingStatus.failed} of {sendingStatus.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${((sendingStatus.success + sendingStatus.failed) / sendingStatus.total) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-green-600">{sendingStatus.success} successful</span>
              {sendingStatus.failed > 0 && (
                <span className="text-red-600">{sendingStatus.failed} failed</span>
              )}
            </div>
          </div>
        )}
        
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={recipients.length === 0 || isSending}
        >
          {isSending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Document for Signing
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 