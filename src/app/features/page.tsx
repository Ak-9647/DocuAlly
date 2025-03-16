'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FileText, 
  PenTool, 
  Users, 
  Shield, 
  Clock, 
  Bell, 
  FileCheck,
  Mail,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FeaturesPage() {
  // Feature sections
  const featureSections = [
    {
      id: 'document-management',
      title: 'Document Management',
      description: 'Upload, organize, and manage all your documents in one secure place.',
      icon: <FileText className="h-12 w-12 text-indigo-600" />,
      features: [
        'Easy document uploading and organization',
        'Securely store sensitive documents',
        'Search and filter documents with ease',
        'Document version history'
      ]
    },
    {
      id: 'electronic-signatures',
      title: 'Electronic Signatures',
      description: 'Legally binding electronic signatures to finalize your documents.',
      icon: <PenTool className="h-12 w-12 text-indigo-600" />,
      features: [
        'Draw or type your signature',
        'Add signing fields to documents',
        'Signature verification',
        'Multi-party signing'
      ]
    },
    {
      id: 'templates',
      title: 'Document Templates',
      description: 'Create and reuse document templates for common scenarios.',
      icon: <FileCheck className="h-12 w-12 text-indigo-600" />,
      features: [
        'Pre-built contract templates',
        'Customizable templates',
        'Save frequently used documents as templates',
        'Template sharing capabilities'
      ]
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Work together on documents with your team or clients.',
      icon: <Users className="h-12 w-12 text-indigo-600" />,
      features: [
        'Share documents with team members',
        'Set permissions for viewing and editing',
        'Comment on documents',
        'Document review workflows'
      ]
    },
    {
      id: 'security',
      title: 'Advanced Security',
      description: 'Keep your documents secure with advanced security features.',
      icon: <Shield className="h-12 w-12 text-indigo-600" />,
      features: [
        'Encryption for all documents',
        'Secure document sharing',
        'Role-based access control',
        'Audit logs for document access'
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Stay updated on document status and required actions.',
      icon: <Bell className="h-12 w-12 text-indigo-600" />,
      features: [
        'Email notifications for pending signatures',
        'Document completion alerts',
        'Comment notifications',
        'Customizable notification preferences'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 pt-32 pb-24">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">Features</h1>
        <p className="text-lg text-gray-600 mb-8">
          DocuAlly provides everything you need for efficient document signing and management.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/register">
            <Button className="bg-gradient-primary">Get Started</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline">View Pricing</Button>
          </Link>
        </div>
      </motion.div>

      {/* Feature sections */}
      <div className="space-y-32 mt-24">
        {featureSections.map((section, index) => (
          <motion.section
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
          >
            <div className="w-full md:w-1/2">
              <div className="p-8 bg-indigo-50 rounded-2xl inline-block mb-6">
                {section.icon}
              </div>
              <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
              <p className="text-gray-600 mb-8 text-lg">{section.description}</p>
              
              <ul className="space-y-3">
                {section.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + (i * 0.1) }}
                    className="flex items-start"
                  >
                    <div className="mr-3 mt-1 text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-soft-lg">
              <div className={`w-full aspect-video bg-gradient-to-br ${
                index % 3 === 0 ? 'from-indigo-500 to-purple-600' : 
                index % 3 === 1 ? 'from-blue-500 to-indigo-600' : 
                'from-violet-500 to-indigo-600'
              } relative`}>
                <div className="absolute inset-0 flex items-center justify-center text-white opacity-70">
                  <p className="text-xl font-semibold">[Feature preview]</p>
                </div>
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* CTA section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-32 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Join thousands of users who are already transforming the way they manage and sign documents with DocuAlly.
        </p>
        <Link href="/register">
          <Button size="lg" className="bg-gradient-primary">
            Sign Up for Free
          </Button>
        </Link>
      </motion.div>
    </div>
  );
} 