'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { formatDistanceToNow } from 'date-fns';
import { FileText, FileImage, File, ExternalLink } from 'lucide-react';
import { DocumentStatusBadge } from '@/components/document-status-badge';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  id: Id<'documents'>;
  title: string;
  status: string;
  createdAt: number;
  ownerId: string;
  fileType?: string;
  fileSize?: number;
}

export function DocumentCard({
  id,
  title,
  status,
  createdAt,
  ownerId,
  fileType,
  fileSize,
}: DocumentCardProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the thumbnail URL from Convex
  const storageId = useQuery(api.documents.getStorageId, { documentId: id });
  
  useEffect(() => {
    if (storageId) {
      // Generate thumbnail URL
      const fetchThumbnail = async () => {
        try {
          // This would be replaced with actual thumbnail generation logic
          // For now, we'll use a placeholder if it's an image type
          if (fileType?.includes('image')) {
            // For images, we could potentially use the actual file
            const url = await fetch(`/api/thumbnails/${id}`).then(res => res.text());
            setThumbnailUrl(url);
          } else {
            // For non-images, use a placeholder based on file type
            setThumbnailUrl(null);
          }
        } catch (error) {
          console.error('Error fetching thumbnail:', error);
          setThumbnailUrl(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchThumbnail();
    }
  }, [storageId, id, fileType]);

  // Format the file size (e.g., 1.2 MB)
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Get the appropriate icon based on file type
  const getFileIcon = () => {
    if (!fileType) return <File className="h-6 w-6" />;
    
    if (fileType.includes('pdf')) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (fileType.includes('image')) {
      return <FileImage className="h-6 w-6 text-blue-500" />;
    } else {
      return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  // Get the appropriate status badge
  const getStatusBadge = () => {
    const statusLower = status.toLowerCase();
    return <DocumentStatusBadge status={status} />;
  };

  return (
    <Link href={`/documents/${id}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
        {/* Thumbnail or placeholder */}
        <div className="relative h-40 bg-gray-100 flex items-center justify-center">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 w-full h-full" />
          ) : thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              {getFileIcon()}
              <span className="text-xs text-gray-500 mt-2">
                {fileType || 'Unknown type'}
              </span>
            </div>
          )}
        </div>
        
        {/* Document info */}
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{title}</h3>
            <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 ml-1" />
          </div>
          
          <div className="mt-2 flex items-center">
            {getStatusBadge()}
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>Created {formatDistanceToNow(new Date(createdAt))} ago</p>
            <p className="mt-1">{formatFileSize(fileSize)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}