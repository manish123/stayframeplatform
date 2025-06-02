// src/components/Stats.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { SimpleStats } from '@/components/landing/SimpleStats';
import { 
  TrendingUp, 
  Users, 
  Sparkles, 
  BarChart3,
  Globe,
  Zap
} from 'lucide-react';

export function Stats() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    if (inView && !counted) {
      setCounted(true);
    }
  }, [inView, counted]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section 
      ref={ref} 
      className="relative overflow-hidden border-t border-border/50 py-20 bg-gradient-to-br from-background via-background to-muted/20"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Platform Statistics</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Content Created
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              See what's being created with our free content creation tools
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            
            {/* Stats container with enhanced styling */}
            <div className="relative backdrop-blur-sm bg-card/50 border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/5 dark:shadow-black/20">
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-accent/20 p-px">
                <div className="h-full w-full rounded-3xl bg-card/80 backdrop-blur-sm" />
              </div>
              
              {/* Stats content */}
              <div className="relative z-10">
                <SimpleStats />
              </div>
              
              {/* Floating icons */}
              <div className="absolute top-6 right-6 opacity-20 dark:opacity-10">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div className="absolute bottom-6 left-6 opacity-20 dark:opacity-10">
                <BarChart3 className="w-6 h-6 text-accent animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Sparkles,
                title: "Free Tools",
                description: "No cost content creation",
                color: "text-blue-500"
              },
              {
                icon: Zap,
                title: "Instant Results",
                description: "Create content in seconds",
                color: "text-yellow-500"
              },
              {
                icon: BarChart3,
                title: "Growing Platform",
                description: "More features coming soon",
                color: "text-green-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl bg-card/30 border border-border/50 p-6 hover:bg-card/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-background/50 border border-border/50 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                
                {/* Hover effect gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </section>
  );
}