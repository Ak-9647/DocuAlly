'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogoIcon } from '@/components/LogoIcon';

interface DocumentUploadFormProps {
  onUpload: (file: File) => void;
}

export function DocumentUploadForm({ onUpload }: DocumentUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onUpload(file);
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    }, 200);
  };
  
  return (
    <Card className="w-full animate-scale">
      <CardContent className="p-8 space-y-8">
        <div className="flex flex-col items-center text-center space-y-3">
          <LogoIcon size="lg" className="text-primary" />
          <h2 className="text-2xl font-semibold font-heading">Upload Your Document</h2>
          <p className="text-muted-foreground max-w-md">
            Upload a PDF, Word document, or image file to begin the signing process
          </p>
        </div>
        
        <div 
          className={`border-2 ${isDragging ? 'border-primary' : 'border-dashed border-primary/40'} rounded-xl p-8 text-center space-y-4 transition-all duration-200 hover:border-primary/60`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-8 w-8 text-primary"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Drag and drop your file here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
            </div>
            
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="bg-primary/10 hover:bg-primary/20 text-primary font-medium py-2 px-4 rounded-md transition-colors duration-200">
                Browse Files
              </div>
              <Input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
            </Label>
          </div>
        </div>
        
        {file && (
          <div className="bg-secondary/30 p-4 rounded-lg flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-md shadow-sm">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-6 w-6 text-primary"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setFile(null)} 
              variant="ghost" 
              size="sm"
              className="text-destructive hover:text-destructive/80"
            >
              Remove
            </Button>
          </div>
        )}
        
        {isUploading && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-200 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="px-6 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
          >
            {isUploading ? 'Uploading...' : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default DocumentUploadForm;
