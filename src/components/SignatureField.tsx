'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SignatureFieldProps {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  page: number;
  label?: string;
  required?: boolean;
  recipientId?: string;
  onDelete?: (id: string) => void;
  onMove?: (id: string, x: number, y: number) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export function SignatureField({
  id,
  x,
  y,
  width = 200,
  height = 80,
  page,
  label = 'Signature',
  required = true,
  recipientId,
  onDelete,
  onMove,
  isSelected = false,
  onSelect,
}: SignatureFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onSelect) {
      onSelect(id);
    }
    
    if (onMove) {
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && onMove) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onMove(id, newX, newY);
      e.stopPropagation();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div
      className={`absolute border-2 rounded-md flex flex-col justify-between ${
        isSelected ? 'border-blue-500 bg-blue-50/50' : 'border-dashed border-gray-400 bg-white/30'
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        cursor: onMove ? 'move' : 'default',
        zIndex: isSelected ? 10 : 5,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex justify-between items-center p-1 bg-white/80 text-xs">
        <span className="font-medium truncate">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {onDelete && (
          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-gray-400 text-sm italic">
          {recipientId ? `Assigned to ${recipientId}` : 'Signature Field'}
        </div>
      </div>
    </div>
  );
}

export default SignatureField; 