// src/components/Hero.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { fadeIn, staggerContainer } from '@/lib/animation';
import { ToolSelector } from './ToolSelector';
import { ProPreviewModal } from './ProPreviewModal';
import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react'; // Only Zap is needed now

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  const [isToolSelectorOpen, setIsToolSelectorOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  
  useEffect(() => {
    // Fetch waitlist count from your API
    const fetchWaitlistCount = async () => {
      try {
        const response = await fetch('/api/waitlist/count');
        if (response.ok) {
          const data = await response.json();
          setWaitlistCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching waitlist count:', error);
      }
    };
    
    fetchWaitlistCount();
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-background via-background to-muted/30" />
      <div className="container relative z-10 py-20 md:py-28 lg:py-36">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-600"
            variants={fadeIn('up')}
          >
            Every Idea Deserves the Perfect Frame
          </motion.h1>
          
          <motion.p 
            className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl"
            variants={fadeIn('up')}
          >
            Transform your creative vision into stunning visual content with intelligent AI tools that understand your artistic intent. No technical expertise required.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            variants={fadeIn('up')}
          >
            <Button 
              size="lg" 
              className="text-base"
              onClick={() => setIsToolSelectorOpen(true)}
            >
              Begin Creating
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base flex items-center" // Added flex items-center for icon alignment
              onClick={() => setIsProModalOpen(true)}
            >
              <Zap className="mr-2 h-5 w-5" />
              Join the Waitlist
            </Button>
          </motion.div>
          
          <motion.p 
            className="text-sm text-muted-foreground mt-4"
            variants={fadeIn('up')} // Added fadeIn animation for consistency
          >
            Join **{waitlistCount?.toLocaleString() || 'thousands'}** enthusiastic creators already on the waitlist for early access!
          </motion.p>
        </motion.div>
      </div>

      <ToolSelector 
        open={isToolSelectorOpen} 
        onOpenChange={setIsToolSelectorOpen} 
      />
      
      <ProPreviewModal 
        open={isProModalOpen} 
        onOpenChange={setIsProModalOpen} 
      />
    </section>
  );
}