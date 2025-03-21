'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const title = type === 'login' ? 'Log In' : 'Create an Account';
  const description = type === 'login' 
    ? 'Enter your credentials to access your account' 
    : 'Fill out the form below to create your account';
  const buttonText = type === 'login' ? 'Log In' : 'Sign Up';
  const alternateLink = type === 'login' 
    ? { text: "Don't have an account?", href: '/register', linkText: 'Sign up' }
    : { text: 'Already have an account?', href: '/login', linkText: 'Log in' };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  {type === 'register' && (
                    <FormDescription>
                      Password must be at least 8 characters long
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === 'login' && (
              <div className="text-sm text-right">
                <a href="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
            )}
            <Button type="submit" className="w-full">
              {buttonText}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-muted-foreground">
          {alternateLink.text}{' '}
          <a href={alternateLink.href} className="text-primary hover:underline">
            {alternateLink.linkText}
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

export default AuthForm;
