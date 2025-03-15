'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DocumentUpload() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      router.push('/dashboard');
    }, 2000);
    
    // In a real implementation, you would upload the file to your server or cloud storage
    // const formData = new FormData();
    // formData.append('file', file);
    // const response = await fetch('/api/documents/upload', {
    //   method: 'POST',
    //   body: formData,
    // });
    // const data = await response.json();
    // router.push(`/documents/${data.id}`);
  };

  if (!isLoaded || !isSignedIn) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Upload Document</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
        
        <div className="bg-white p-8 rounded-lg border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Document Title</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="Enter document title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Upload File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                {file ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Selected file:</p>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setFile(null)}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                      <Button type="button" variant="outline" size="sm">
                        Browse Files
                      </Button>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: PDF, DOC, DOCX
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={!file || uploading}>
                {uploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
