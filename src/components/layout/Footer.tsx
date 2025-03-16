'use client';

import React from 'react';
import Link from 'next/link';
import { LogoIcon } from '@/components/LogoIcon';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Integrations", href: "/integrations" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Guides", href: "/guides" },
        { name: "Blog", href: "/blog" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" }
      ]
    }
  ];
  
  const socialLinks = [
    { 
      name: "Twitter", 
      href: "#", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
    },
    { 
      name: "LinkedIn", 
      href: "#", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
    },
    { 
      name: "GitHub", 
      href: "#", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
    }
  ];

  return (
    <footer className="relative border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 opacity-30 blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 h-60 w-60 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 opacity-30 blur-3xl"></div>
      </div>
      
      <div className="container relative py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Logo and description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="relative overflow-hidden rounded-xl">
                <LogoIcon size="sm" color="#4F46E5" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-blue-600/10"></div>
              </div>
              <span className="font-heading font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">DocuAlly</span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              A modern document signing platform with AI-powered features for seamless collaboration.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="text-gray-500 hover:text-indigo-600 transition-colors duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Footer links */}
          {footerLinks.map((column, columnIndex) => (
            <motion.div 
              key={column.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (columnIndex + 1) }}
              className="space-y-6"
            >
              <h4 className="text-sm font-semibold text-gray-900">{column.title}</h4>
              <ul className="space-y-4 text-sm">
                {column.links.map((link, linkIndex) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * (columnIndex + 1) + (0.05 * linkIndex) }}
                  >
                    <Link 
                      href={link.href} 
                      className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Copyright and bottom section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-sm text-gray-500">
            &copy; {currentYear} DocuAlly. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Link href="/status" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-300">
              System Status
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/accessibility" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-300">
              Accessibility
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/cookies" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-300">
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
