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

export function Header() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <header className="navbar animate-fade-in">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <LogoIcon size="md" />
            <span className="font-heading font-bold text-xl">SignFlow</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-md px-2 py-1">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-md px-2 py-1">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-md px-2 py-1">
            About
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 transition-all duration-200 hover:ring-2 hover:ring-primary/30">
                    <AvatarImage src={user?.imageUrl || ""} alt={user?.firstName || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.firstName?.[0] || user?.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 animate-scale" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.emailAddresses?.[0]?.emailAddress}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus-ring">
                  <Link href="/dashboard" className="w-full">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus-ring">
                  <Link href="/documents" className="w-full">Documents</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus-ring">
                  <Link href="/settings" className="w-full">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus-ring">
                  <UserButton afterSignOutUrl="/" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" className="font-medium text-sm focus-ring">Log in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 focus-ring">Sign up</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;