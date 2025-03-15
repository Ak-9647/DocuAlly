'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRegister = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    
    // In a real implementation, this would call the registration API
    // For demo purposes, we'll simulate a delay and successful registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful registration
    console.log('Registration successful:', values);
    
    // Redirect to dashboard
    router.push('/dashboard');
    
    setIsLoading(false);
  };
  
  return (
    <div className="container max-w-screen-xl mx-auto py-12">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="text-muted-foreground">
            Sign up for NotDocuSign to start sending and signing documents
          </p>
        </div>
        
        <div className="w-full max-w-md">
          <AuthForm type="register" onSubmit={handleRegister} />
        </div>
      </div>
    </div>
  );
}
