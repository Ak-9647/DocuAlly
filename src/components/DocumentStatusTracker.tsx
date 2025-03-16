import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, UserCheck, FileText } from 'lucide-react';

interface Recipient {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'signed' | 'declined' | 'viewed';
  signedAt?: string;
  viewedAt?: string;
}

interface DocumentStatusTrackerProps {
  documentId: string;
  documentName: string;
  documentStatus: 'draft' | 'sent' | 'completed' | 'expired' | 'cancelled';
  createdAt: string;
  expiresAt?: string;
  recipients: Recipient[];
  isSequential?: boolean;
}

export function DocumentStatusTracker({
  documentId,
  documentName,
  documentStatus,
  createdAt,
  expiresAt,
  recipients,
  isSequential = true
}: DocumentStatusTrackerProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'sent':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'draft':
        return <FileText className="h-5 w-5 text-gray-500" />;
      case 'expired':
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'sent':
        return 'In Progress';
      case 'draft':
        return 'Draft';
      case 'expired':
        return 'Expired';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecipientStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'declined':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'viewed':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRecipientStatusText = (status: string) => {
    switch (status) {
      case 'signed':
        return 'Signed';
      case 'pending':
        return 'Waiting';
      case 'declined':
        return 'Declined';
      case 'viewed':
        return 'Viewed';
      default:
        return 'Waiting';
    }
  };

  const calculateProgress = () => {
    if (recipients.length === 0) return 0;
    const signedCount = recipients.filter(r => r.status === 'signed').length;
    return Math.round((signedCount / recipients.length) * 100);
  };

  const progress = calculateProgress();
  const sortedRecipients = isSequential 
    ? [...recipients].sort((a, b) => {
        // Sort by order if available, otherwise keep original order
        return (a.id > b.id) ? 1 : -1;
      })
    : recipients;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Document Status</span>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(documentStatus)}`}>
            {getStatusText(documentStatus)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Document Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Document Name:</span>
              <span className="font-medium">{documentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Created:</span>
              <span>{new Date(createdAt).toLocaleDateString()}</span>
            </div>
            {expiresAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Expires:</span>
                <span>{new Date(expiresAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Signature Progress</h3>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Recipients</h3>
          <div className="space-y-3">
            {sortedRecipients.map((recipient, index) => (
              <div 
                key={recipient.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex items-center">
                  {isSequential && (
                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
                      {index + 1}
                    </span>
                  )}
                  <div>
                    <p className="font-medium text-sm">{recipient.name}</p>
                    <p className="text-xs text-gray-500">{recipient.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {recipient.status === 'signed' && recipient.signedAt && (
                    <span className="text-xs text-gray-500 mr-2">
                      {new Date(recipient.signedAt).toLocaleDateString()}
                    </span>
                  )}
                  <div className="flex items-center">
                    {getRecipientStatusIcon(recipient.status)}
                    <span className="ml-1 text-xs">
                      {getRecipientStatusText(recipient.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {documentStatus === 'completed' && (
          <div className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-md">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>All signatures have been collected!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}