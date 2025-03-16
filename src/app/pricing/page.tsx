'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 pt-32 pb-24">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-gray-600 mb-8">
          DocuAlly is currently <span className="font-semibold text-indigo-600">completely free</span> during our beta period.
        </p>
      </motion.div>

      {/* Pricing plan */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-md mx-auto overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-soft-lg transition-all hover:shadow-soft-xl"
      >
        <div className="p-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Free Plan</h3>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
              BETA
            </span>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-5xl font-bold">$0</span>
            <span className="ml-1 text-xl text-gray-500">/month</span>
          </div>
          <p className="mt-5 text-gray-600">
            Access all features during our beta period. No credit card required.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              'Document uploading & processing',
              'Electronic signatures',
              'Basic document templates',
              'Document management',
              'Email notifications',
              'Up to 10 documents per month',
              'Secure document storage'
            ].map((feature) => (
              <li key={feature} className="flex items-center">
                <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="ml-3 text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>

          <Link href="/register">
            <Button className="mt-8 w-full bg-gradient-primary">
              Sign Up for Free
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* FAQ section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-20 max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-soft-sm">
            <h3 className="font-semibold text-lg mb-2">How long will DocuAlly be free?</h3>
            <p className="text-gray-600">
              DocuAlly is free during our beta period. We'll provide advance notice before introducing paid plans.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-soft-sm">
            <h3 className="font-semibold text-lg mb-2">Are there any usage limits?</h3>
            <p className="text-gray-600">
              The free plan currently includes up to 10 documents per month with all features included.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-soft-sm">
            <h3 className="font-semibold text-lg mb-2">Do I need a credit card to sign up?</h3>
            <p className="text-gray-600">
              No credit card is required. Simply create an account and start using DocuAlly.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 