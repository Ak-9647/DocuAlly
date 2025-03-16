import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DocumentStatusBadge } from '@/components/document-status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BadgesExamplePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Badge Components</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Badges</CardTitle>
            <CardDescription>
              Different variants of the Badge component
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Badge Sizes</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Badge size="sm">Small</Badge>
                <Badge size="default">Default</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Document Status Badges</CardTitle>
            <CardDescription>
              Specialized badges for document statuses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium w-24">Draft:</span>
                <DocumentStatusBadge status="draft" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium w-24">Sent:</span>
                <DocumentStatusBadge status="sent" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium w-24">Completed:</span>
                <DocumentStatusBadge status="completed" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium w-24">Custom:</span>
                <DocumentStatusBadge status="custom" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              Examples of how to use badges in different contexts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Document List</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center">
                    <span>Employment Contract</span>
                    <DocumentStatusBadge status="draft" />
                  </li>
                  <li className="flex justify-between items-center">
                    <span>NDA</span>
                    <DocumentStatusBadge status="sent" />
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Lease Agreement</span>
                    <DocumentStatusBadge status="completed" />
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Recipients</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center">
                    <span>john@example.com</span>
                    <Badge variant="success">Signed</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>jane@example.com</span>
                    <Badge variant="warning">Pending</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>legal@company.com</span>
                    <Badge variant="info">Reviewing</Badge>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Notifications</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Badge variant="destructive" size="sm">1</Badge>
                    <span>Document rejected</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="success" size="sm">3</Badge>
                    <span>Documents signed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary" size="sm">5</Badge>
                    <span>New comments</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 