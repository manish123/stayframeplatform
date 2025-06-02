'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Spinner, Google, GitHub } from '@/components/ui/Icons';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const mode = searchParams?.get('mode');
  const error = searchParams?.get('error');

  // Type the event handlers properly
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // Set initial auth mode based on URL parameter
  useEffect(() => {
    if (mode === 'signup') {
      setAuthMode('signup');
    }
  }, [mode]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Authentication Error',
        description: 
          error === 'OAuthAccountNotLinked' 
            ? 'This email is already registered with a different provider.'
            : 'An error occurred during sign in. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, callbackUrl, router]);

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, you would handle email/password auth here
      // For now, we'll just show a message
      toast({
        title: 'Email/Password Auth Coming Soon',
        description: 'Please use a social provider to sign in.',
        variant: 'default',
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      toast({
        title: 'Error',
        description: `Failed to sign in with ${provider}. Please try again.`,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <div className="container relative flex-1 flex flex-col items-center justify-center p-4">
        <div className="mx-auto w-full max-w-md">
          <Card className="p-8">
            <div className="flex flex-col space-y-2 text-center mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">
                {authMode === 'login' ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {authMode === 'login' 
                  ? 'Enter your email to sign in to your account' 
                  : 'Enter your details to create a new account'}
              </p>
            </div>

            <div className="grid gap-4">
              <Button 
                variant="outline" 
                type="button" 
                disabled={isLoading}
                onClick={() => handleSocialSignIn('google')}
                className="w-full"
              >
                {isLoading ? (
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Google className="mr-2 h-4 w-4" />
                )}
                Continue with Google
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                disabled={isLoading}
                onClick={() => handleSocialSignIn('github')}
                className="w-full"
              >
                {isLoading ? (
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <GitHub className="mr-2 h-4 w-4" />
                )}
                Continue with GitHub
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="name"
                      autoCorrect="off"
                      disabled={isLoading}
                      value={name}
                      onChange={handleNameChange}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {authMode === 'login' && (
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                    disabled={isLoading}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
              
              <p className="px-8 text-center text-sm text-muted-foreground">
                {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  {authMode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </Card>
          
          <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
