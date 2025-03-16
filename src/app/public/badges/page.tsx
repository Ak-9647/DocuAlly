import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DocumentStatusBadge } from '@/components/document-status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PublicBadgesPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Badge Components Gallery</h1>
      
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
      </div>
    </div>
  );
} 