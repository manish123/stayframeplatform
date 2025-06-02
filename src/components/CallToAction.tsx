// src/components/CallToAction.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

interface CallToActionProps {
  onGetStarted: () => void;
}

export function CallToAction({ onGetStarted }: CallToActionProps) {
  return (
    <section className="py-12 md:py-24 bg-gradient-to-b from-muted/50 to-background">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Transform Your Vision Into Reality</h2>
          <p className="mx-auto mt-4 max-w-[600px] text-muted-foreground">
            Join a thriving community of creators who are already elevating their content and amplifying their creative voice with StayFrame.
          </p>
          <Button 
            size="lg" 
            className="mt-8 gap-2 group"
            onClick={onGetStarted}
          >
            Begin Your Creative Journey
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}