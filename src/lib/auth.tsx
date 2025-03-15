'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth, SignIn, SignUp } from '@clerk/nextjs';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded: isClerkLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerkAuth();

  // Map Clerk's authentication state to our app's authentication context
  const authContextValue: AuthContextType = {
    isAuthenticated: isSignedIn || false,
    isLoading: !isClerkLoaded,
    user: user
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
