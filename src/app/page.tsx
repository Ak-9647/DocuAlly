'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, useAuth } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span className="block">Sign Documents Securely</span>
          <span className="block text-primary mt-2">With Not-DocuSign</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-3xl">
          A simple, secure, and efficient way to sign documents online. Upload your documents, add signatures, and share with others - all in one place.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          {isSignedIn ? (
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <SignUpButton mode="modal">
                <Button size="lg">Get Started</Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button variant="outline" size="lg">Sign In</Button>
              </SignInButton>
            </>
          )}
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 border rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Easy Document Signing</h3>
          <p className="text-gray-600">
            Upload your documents and sign them with just a few clicks. No complicated processes.
          </p>
        </div>
        <div className="p-6 border rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Secure & Compliant</h3>
          <p className="text-gray-600">
            Your documents are encrypted and stored securely. We follow industry standards for document signing.
          </p>
        </div>
        <div className="p-6 border rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Collaborate Easily</h3>
          <p className="text-gray-600">
            Share documents with others for signing. Track progress and get notified when documents are signed.
          </p>
        </div>
      </div>
    </div>
  );
} 