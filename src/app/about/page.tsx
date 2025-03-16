'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Akshay Ramesh Nair',
      role: 'Founder & Developer',
      image: '/profile-photo.jpg', // Using a placeholder path assuming image will be placed in public folder
      bio: 'Software engineer and entrepreneur passionate about building intuitive document solutions that simplify workflow management.',
      links: [
        { icon: <Github className="h-5 w-5" />, url: 'https://github.com/akshayrn', label: 'GitHub' },
        { icon: <Linkedin className="h-5 w-5" />, url: 'https://linkedin.com/in/akshayrn', label: 'LinkedIn' },
        { icon: <Mail className="h-5 w-5" />, url: 'mailto:akshay@docually.com', label: 'Email' }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 pt-32 pb-24">
      {/* About header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <h1 className="text-4xl font-bold mb-4">About DocuAlly</h1>
        <p className="text-lg text-gray-600">
          Simplifying document signing and management for everyone.
        </p>
      </motion.div>

      {/* Mission section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-4xl mx-auto mb-20"
      >
        <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
        <p className="text-lg text-gray-600 mb-6">
          DocuAlly was created with a simple mission: to make document signing and management accessible, 
          efficient, and stress-free for individuals and businesses of all sizes.
        </p>
        <p className="text-lg text-gray-600">
          In today's digital world, document workflows should be seamless. We've built a platform that 
          combines ease of use with powerful features to help you handle documents more efficiently than ever before.
        </p>
      </motion.section>

      {/* Story section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto mb-20"
      >
        <h2 className="text-2xl font-bold mb-6">Our Story</h2>
        <p className="text-lg text-gray-600 mb-6">
          DocuAlly started as a personal project to solve the frustrations of document signing. After 
          experiencing the complexity and high costs of existing solutions, we set out to build something better.
        </p>
        <p className="text-lg text-gray-600">
          What began as a simple tool has evolved into a comprehensive platform for document management, 
          designed with users' needs at its core. We're constantly improving and adding new features 
          based on feedback from our growing community.
        </p>
      </motion.section>

      {/* Team section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-4xl mx-auto mb-20"
      >
        <h2 className="text-2xl font-bold mb-10">Meet the Developer</h2>
        
        <div className="grid grid-cols-1 gap-12">
          {teamMembers.map((member) => (
            <motion.div 
              key={member.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-xl p-8 shadow-soft-md"
            >
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-indigo-100 shadow-soft-md relative">
                <div className="aspect-square bg-gradient-to-br from-indigo-50 to-gray-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={192}
                    height={192}
                    className="object-cover h-full w-full"
                  />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-indigo-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 mb-6">{member.bio}</p>
                
                <div className="flex gap-4 justify-center md:justify-start">
                  {member.links.map((link, i) => (
                    <a 
                      key={i} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-300"
                      aria-label={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Values section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-4xl mx-auto mb-24"
      >
        <h2 className="text-2xl font-bold mb-10">Our Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Simplicity',
              description: 'We believe that powerful software should also be simple to use. Every feature is designed with user experience as our top priority.'
            },
            {
              title: 'Security',
              description: 'Your documents contain sensitive information. We implement advanced security measures to ensure your data is always protected.'
            },
            {
              title: 'Innovation',
              description: "We're constantly looking for new ways to improve document workflows through thoughtful features and integration capabilities."
            }
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + (i * 0.1) }}
              className="bg-white p-6 rounded-xl shadow-soft-sm border border-gray-100"
            >
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4">Join Us on This Journey</h2>
        <p className="text-lg text-gray-600 mb-8">
          We're just getting started, and we'd love for you to be part of our story. Sign up today and experience a better way to manage your documents.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/register">
            <Button className="bg-gradient-primary">Sign Up Free</Button>
          </Link>
          <Link href="/features">
            <Button variant="outline">Explore Features</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 