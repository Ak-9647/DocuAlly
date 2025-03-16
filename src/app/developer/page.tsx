'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DeveloperPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <Link href="/" className="text-primary hover:underline flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8 md:p-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">Developer Profile</h1>
          <p className="mt-2 text-indigo-100">Meet the creator behind DocuAlly</p>
        </div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-48 h-48 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              AN
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">Akshay Ramesh Nair</h2>
              <p className="text-gray-600 mt-1">Full Stack Developer & Founder</p>
              <p className="mt-2 text-gray-500">akshayramesh.nair.informa@gmail.com</p>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">About Me</h3>
                <p className="text-gray-700">
                  I'm a passionate developer with expertise in building modern web applications. With a strong focus on creating intuitive user experiences, I developed DocuAlly to simplify document signing and management for individuals and businesses of all sizes.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">React</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Next.js</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">TypeScript</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Node.js</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Tailwind CSS</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">MongoDB</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">UI/UX Design</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">AWS</span>
            </div>
          </div>
          
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Project Portfolio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800">DocuAlly</h4>
                <p className="mt-2 text-gray-700">
                  A secure document signing platform with advanced authentication and real-time collaboration features.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Next.js</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Clerk Auth</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Convex</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800">Author Ally</h4>
                <p className="mt-2 text-gray-700">
                  A writing management platform for authors to track progress and organize documents.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">React</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Firebase</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Tailwind</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Connect With Me</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  GitHub
                </Button>
              </a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                  LinkedIn
                </Button>
              </a>
              <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                  Twitter
                </Button>
              </a>
              <a href="mailto:akshayramesh.nair.informa@gmail.com">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
