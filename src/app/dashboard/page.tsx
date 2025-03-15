'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Documents to Sign</h3>
          <p className="text-gray-600 mb-4">You have 0 documents waiting for your signature.</p>
          <Link href="/documents">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Documents Sent</h3>
          <p className="text-gray-600 mb-4">You have sent 0 documents for signing.</p>
          <Link href="/documents">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Completed Documents</h3>
          <p className="text-gray-600 mb-4">You have 0 completed documents.</p>
          <Link href="/documents">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Link href="/documents/upload">
          <Button size="lg">Upload New Document</Button>
        </Link>
      </div>
    </div>
  );
}
