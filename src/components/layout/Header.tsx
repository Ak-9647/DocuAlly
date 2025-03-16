'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoIcon } from '@/components/LogoIcon';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth';
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-soft-md' 
          : 'bg-transparent'
      )}
    >
      <div className="container flex h-20 items-center justify-between py-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-110">
              <LogoIcon size="md" variant="gradient" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="font-heading font-bold text-xl bg-clip-text text-transparent bg-gradient-primary">DocuAlly</span>
          </Link>
        </motion.div>
        
        <motion.nav 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex items-center gap-8"
        >
          {['Features', 'Pricing', 'Templates', 'E-Sign Demo', 'About'].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + (i * 0.1) }}
            >
              <Link 
                href={item === 'E-Sign Demo' ? '/documents/sample-123' : `/${item.toLowerCase()}`} 
                className="text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 focus-ring rounded-md px-3 py-2 relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
        </motion.nav>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-4"
        >
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden p-0 border-2 border-transparent hover:border-indigo-200 transition-all duration-300">
                  <Avatar className="h-full w-full transition-all duration-300">
                    <AvatarImage src={user?.imageUrl || ""} alt={user?.firstName || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                      {user?.firstName?.[0] || user?.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs leading-none text-gray-500">{user?.emailAddresses?.[0]?.emailAddress}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['Dashboard', 'Documents', 'Settings'].map((item) => (
                  <DropdownMenuItem key={item} className="cursor-pointer">
                    <Link href={`/${item.toLowerCase()}`} className="w-full flex items-center">
                      <span className="w-8 h-8 mr-2 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                        {item === 'Dashboard' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                        )}
                        {item === 'Documents' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
                        )}
                        {item === 'Settings' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                        )}
                      </span>
                      {item}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <UserButton afterSignOutUrl="/" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" className="font-medium text-sm focus-ring px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300">
                  Log in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="font-medium text-sm shadow-soft-sm hover:shadow-soft-md transition-all duration-300 bg-gradient-primary text-white rounded-lg px-5 py-2.5">
                  Sign up
                </Button>
              </SignUpButton>
            </>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}

export default Header;