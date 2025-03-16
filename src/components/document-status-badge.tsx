import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, CheckCircle, FileText } from 'lucide-react';

type DocumentStatus = 'draft' | 'sent' | 'completed' | string;

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
  const getStatusConfig = (status: DocumentStatus) => {
    switch (status) {
      case 'draft':
        return {
          label: 'Draft',
          variant: 'secondary' as const,
          icon: <Clock className="h-3 w-3 mr-1" />
        };
      case 'sent':
        return {
          label: 'Awaiting Signatures',
          variant: 'warning' as const,
          icon: <AlertCircle className="h-3 w-3 mr-1" />
        };
      case 'completed':
        return {
          label: 'Completed',
          variant: 'success' as const,
          icon: <CheckCircle className="h-3 w-3 mr-1" />
        };
      default:
        return {
          label: status,
          variant: 'default' as const,
          icon: <FileText className="h-3 w-3 mr-1" />
        };
    }
  };

  const { label, variant, icon } = getStatusConfig(status);

  return (
    <Badge variant={variant} className={`flex items-center ${className || ''}`}>
      {icon}
      <span>{label}</span>
    </Badge>
  );
} 