'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner, Google } from '@/components/ui/Icons';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const error = searchParams?.get('error');

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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google. Please try again.',
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
                Welcome
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account using Google
              </p>
            </div>

            <div className="grid gap-4">
              <Button 
                variant="outline" 
                type="button" 
                disabled={isLoading}
                onClick={handleGoogleSignIn}
                className="w-full"
              >
                {isLoading ? (
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Google className="mr-2 h-4 w-4" />
                )}
                Continue with Google
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
