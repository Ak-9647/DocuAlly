'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface EmailLog {
  id: string;
  documentId: string;
  recipientEmail?: string;
  emailType: string;
  status: string;
  sentAt: number;
  metadata: Record<string, any>;
}

export default function EmailTrackingPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState('test-doc-123'); // Default to a test document ID
  const [testEmail, setTestEmail] = useState('');
  
  const searchParams = useSearchParams();
  const docId = searchParams.get('documentId');
  
  useEffect(() => {
    if (docId) {
      setDocumentId(docId);
      fetchLogs(docId);
    } else {
      fetchLogs(documentId);
    }
  }, [docId]);
  
  const fetchLogs = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/email/logs/document?documentId=${id}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching logs: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.data);
      } else {
        setError(data.error || 'Failed to fetch logs');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (documentId) {
      fetchLogs(documentId);
    }
  };
  
  const handleSendTestEmail = async () => {
    try {
      const email = testEmail || 'test@example.com';
      const response = await fetch(`/api/test-email-tracking?to=${email}&documentId=${documentId}`);
      
      if (!response.ok) {
        throw new Error(`Error sending test email: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Test email sent successfully! Check ${email} for the email.`);
        // Refresh logs after a short delay to allow for processing
        setTimeout(() => fetchLogs(documentId), 1000);
      } else {
        alert(`Failed to send test email: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    }
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'opened':
        return 'bg-green-100 text-green-800';
      case 'clicked':
        return 'bg-purple-100 text-purple-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Email Tracking Dashboard</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            placeholder="Enter Document ID"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View Logs
          </button>
        </div>
      </form>
      
      <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Email Tracking</h2>
        <p className="mb-4">Send a test email to verify tracking functionality:</p>
        <div className="flex gap-4 mb-4">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Enter email address (optional)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSendTestEmail}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Send Test Email
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <p>Note: If you don't provide an email, a test email will be simulated without actually sending.</p>
          <p>After sending, open the email and click links to see tracking in action.</p>
          <p>Click "View Logs" to refresh the tracking data.</p>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p>Loading email logs...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No email logs found for this document.</p>
          <p className="mt-2">Try sending a test email using the form above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {log.emailType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.recipientEmail || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(log.sentAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.metadata.statusUpdatedAt ? formatDate(log.metadata.statusUpdatedAt) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => alert(JSON.stringify(log.metadata, null, 2))}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How Email Tracking Works</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>When an email is sent, a unique ID is generated and stored.</li>
          <li>A transparent 1x1 pixel image is included in the email, with the ID as a parameter.</li>
          <li>When the recipient opens the email, the pixel loads, sending the ID to our server.</li>
          <li>Links in the email are wrapped with tracking URLs that record when they're clicked.</li>
          <li>All tracking events are logged and displayed in this dashboard.</li>
        </ol>
      </div>
    </div>
  );
} 