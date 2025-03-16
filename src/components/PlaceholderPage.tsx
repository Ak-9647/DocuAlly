import Link from 'next/link';
import React from 'react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  linkText?: string;
  linkHref?: string;
  comingSoon?: boolean;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description = "We're currently working on this page. Please check back soon!",
  linkText = "Return Home",
  linkHref = "/",
  comingSoon = true
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        {comingSoon && (
          <div className="inline-block px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full mb-4">
            Coming Soon
          </div>
        )}
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        
        <p className="text-gray-600 mb-8">
          {description}
        </p>
        
        <Link 
          href={linkHref}
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}; 